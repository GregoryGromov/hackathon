import logging
import re
import subprocess
import uuid
from dataclasses import dataclass
from pathlib import Path

from django.conf import settings

from .exceptions import SubmissionProcessingError

logger = logging.getLogger(__name__)


@dataclass
class RunnerExecutionResult:
    stdout: str
    stderr: str


def _tail(text: str) -> str:
    return text[-settings.RUNNER_STDIO_MAX_CHARS :].strip()


def _last_error_line(output: str) -> str:
    lines = [line.strip() for line in output.splitlines() if line.strip()]
    if not lines:
        return ""

    # Prefer the final Python exception line instead of dumping a full traceback to users.
    for line in reversed(lines):
        if re.match(r"^[A-Za-z_][\w.]*?(Error|Exception|Warning):", line):
            return line
    return lines[-1]


def _first_match(patterns, text: str):
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE | re.MULTILINE)
        if match:
            return match
    return None


def _classify_runner_failure(stdout: str, stderr: str) -> str:
    combined = f"{stderr}\n{stdout}".strip()
    if not combined:
        return ""

    checks = [
        (
            [r"solution\.py must define PredictionModel"],
            "solution.py must define a PredictionModel class.",
        ),
        (
            [r"Archive must contain solution\.py", r"No solution\.py"],
            "Archive must contain exactly one solution.py file.",
        ),
        (
            [r"Archive must contain exactly one solution\.py"],
            "Archive must contain exactly one solution.py file.",
        ),
        (
            [r"Prediction is not needed"],
            "predict() returned a value while data_point.need_prediction is false. Return None for warm-up rows.",
        ),
        (
            [r"Prediction is required"],
            "predict() returned None while data_point.need_prediction is true. Return a numeric array with shape (2,).",
        ),
        (
            [r"Prediction has wrong shape:\s*(.+?)\s*!=\s*\(2,\)"],
            "predict() returned the wrong shape. Expected a numeric array with shape (2,).",
        ),
        (
            [r"Prediction contains NaN or infinite values"],
            "predict() returned NaN or infinite values. Return only finite numeric predictions.",
        ),
        (
            [r"Submission did not produce any predictions"],
            "Submission did not produce any predictions.",
        ),
        (
            [r"Dataset must contain metadata, 32 features, and at least 2 targets"],
            "Server dataset has an invalid format. Contact support.",
        ),
        (
            [r"Read-only file system", r"PermissionError"],
            "Submission tried to write to a read-only location. Write temporary files only under /tmp.",
        ),
        (
            [r"Network is unreachable", r"Temporary failure in name resolution", r"Name or service not known"],
            "Submission tried to use network access, but runner internet access is disabled.",
        ),
    ]

    for patterns, message in checks:
        if _first_match(patterns, combined):
            return message

    missing_dependency = _first_match(
        [r"ModuleNotFoundError:\s*No module named ['\"]([^'\"]+)['\"]"],
        combined,
    )
    if missing_dependency:
        package_name = missing_dependency.group(1)
        return (
            f"Missing dependency: {package_name}. Use packages available in the runner "
            "or bundle your own pure-Python code inside the ZIP."
        )

    syntax_error = _first_match([r"SyntaxError:\s*(.+)"], combined)
    if syntax_error:
        return f"solution.py has a syntax error: {syntax_error.group(1).strip()}"

    file_error = _first_match([r"FileNotFoundError:\s*(.+)"], combined)
    if file_error:
        return f"Submission tried to read a missing file: {file_error.group(1).strip()}"

    final_line = _last_error_line(combined)
    if final_line:
        return f"Submission code failed: {final_line}"

    return ""


def _runner_failure_message(returncode: int, stdout: str, stderr: str) -> str:
    if returncode in {137, -9}:
        return "Runner was killed, likely because the submission exceeded the memory limit."

    classified_message = _classify_runner_failure(stdout, stderr)
    if classified_message:
        return classified_message

    details = _tail(stderr) or _tail(stdout)
    if not details:
        return "Runner execution failed without error output."

    return f"Runner execution failed: {details}"


def ensure_runner_prerequisites():
    if not Path(settings.TEST_DATA_PATH).exists():
        raise SubmissionProcessingError("Server test dataset is missing.")
    if settings.RUNNER_IMAGE not in settings.RUNNER_IMAGE_ALLOWLIST:
        raise SubmissionProcessingError("Configured runner image is not allowlisted.")


def run_submission_in_runner(workspace_dir: Path, output_dir: Path, submission_id: int) -> RunnerExecutionResult:
    ensure_runner_prerequisites()
    output_dir.mkdir(parents=True, exist_ok=True)
    output_dir.chmod(0o777)

    container_name = f"submission-{submission_id}-{uuid.uuid4().hex[:12]}"
    docker_cmd = [
        "docker",
        "run",
        "--rm",
        "--name",
        container_name,
        "--network",
        "none",
        "--cpus",
        str(settings.RUNNER_CPUS),
        "--memory",
        str(settings.RUNNER_MEMORY),
        "--pids-limit",
        str(settings.RUNNER_PIDS_LIMIT),
        "--read-only",
        "--cap-drop",
        "ALL",
        "--security-opt",
        "no-new-privileges",
        "--user",
        settings.RUNNER_USER,
        "--tmpfs",
        f"/tmp:rw,noexec,nosuid,size={settings.RUNNER_TMPFS_SIZE}",
        "--mount",
        f"type=bind,src={workspace_dir.resolve()},dst=/submission,readonly",
        "--mount",
        f"type=bind,src={Path(settings.TEST_DATA_PATH).resolve()},dst=/data/test.parquet,readonly",
        "--mount",
        f"type=bind,src={output_dir.resolve()},dst=/output",
        settings.RUNNER_IMAGE,
        "python",
        "/opt/action-arena/scorer.py",
        "--data",
        "/data/test.parquet",
        "--solution",
        "/submission",
        "--output",
        "/output/score.json",
    ]

    logger.info("Starting runner container for submission=%s", submission_id)
    process = subprocess.Popen(
        docker_cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )

    try:
        stdout, stderr = process.communicate(timeout=settings.RUNNER_TIMEOUT_SECONDS)
    except subprocess.TimeoutExpired as exc:
        subprocess.run(
            ["docker", "kill", container_name],
            check=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        stdout, stderr = process.communicate()
        logger.warning(
            "Runner timeout submission=%s stdout=%s stderr=%s",
            submission_id,
            stdout[-settings.RUNNER_STDIO_MAX_CHARS :],
            stderr[-settings.RUNNER_STDIO_MAX_CHARS :],
        )
        raise SubmissionProcessingError(
            f"Submission exceeded the time limit of {settings.RUNNER_TIMEOUT_SECONDS} seconds."
        ) from exc

    if process.returncode != 0:
        logger.warning(
            "Runner failed submission=%s returncode=%s stdout=%s stderr=%s",
            submission_id,
            process.returncode,
            stdout[-settings.RUNNER_STDIO_MAX_CHARS :],
            stderr[-settings.RUNNER_STDIO_MAX_CHARS :],
        )
        raise SubmissionProcessingError(_runner_failure_message(process.returncode, stdout, stderr))

    score_path = output_dir / "score.json"
    if not score_path.is_file():
        raise SubmissionProcessingError("Runner finished without producing score.json.")

    return RunnerExecutionResult(stdout=stdout, stderr=stderr)
