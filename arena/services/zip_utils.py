import os
import shutil
import stat
import zipfile
from pathlib import Path, PurePosixPath

from django.conf import settings

from .exceptions import SubmissionProcessingError


def _is_symlink(info):
    mode = (info.external_attr >> 16) & 0xFFFF
    return stat.S_IFMT(mode) == stat.S_IFLNK


def safe_extract_submission(zip_path: Path, destination: Path) -> Path:
    destination.mkdir(parents=True, exist_ok=True)
    extracted_files = 0
    total_unpacked = 0
    solution_path = None
    destination_root = destination.resolve(strict=False)

    with zipfile.ZipFile(zip_path) as archive:
        infos = archive.infolist()
        if not infos:
            raise SubmissionProcessingError("Archive is empty.")

        for info in infos:
            raw_name = info.filename
            if info.flag_bits & 0x1:
                raise SubmissionProcessingError("Encrypted ZIP archives are not supported.")
            if _is_symlink(info):
                raise SubmissionProcessingError("Symlinks are not allowed inside submission ZIPs.")

            normalized = PurePosixPath(raw_name)
            if normalized.is_absolute():
                raise SubmissionProcessingError("Archive contains absolute paths.")
            if not normalized.parts or any(part in {"", ".", ".."} for part in normalized.parts):
                raise SubmissionProcessingError("Archive contains unsafe paths.")

            target_path = destination.joinpath(*normalized.parts)
            resolved_target = target_path.resolve(strict=False)
            if os.path.commonpath([str(destination_root), str(resolved_target)]) != str(destination_root):
                raise SubmissionProcessingError("Archive contains path traversal entries.")

            if info.is_dir():
                target_path.mkdir(parents=True, exist_ok=True)
                target_path.chmod(0o755)
                continue

            extracted_files += 1
            if extracted_files > settings.ZIP_MAX_FILES:
                raise SubmissionProcessingError("Archive contains too many files.")

            total_unpacked += info.file_size
            if total_unpacked > settings.ZIP_MAX_UNPACKED_BYTES:
                raise SubmissionProcessingError("Archive exceeds the allowed unpacked size.")

            if info.compress_size == 0 and info.file_size > 0:
                raise SubmissionProcessingError("Archive contains suspicious zero-size compressed entries.")

            if info.compress_size and info.file_size / max(info.compress_size, 1) > settings.ZIP_MAX_COMPRESSION_RATIO:
                raise SubmissionProcessingError("Archive compression ratio is suspiciously high.")

            target_path.parent.mkdir(parents=True, exist_ok=True)
            with archive.open(info, "r") as source, target_path.open("wb") as target:
                shutil.copyfileobj(source, target, length=1024 * 1024)
            target_path.chmod(0o644)

            if normalized.name == "solution.py":
                if solution_path is not None:
                    raise SubmissionProcessingError("Archive must contain exactly one solution.py.")
                solution_path = target_path

    if solution_path is None or not solution_path.is_file():
        raise SubmissionProcessingError("Archive must contain solution.py.")

    return solution_path
