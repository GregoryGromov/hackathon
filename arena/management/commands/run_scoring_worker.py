import logging
import shutil
import time
import uuid
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from arena.models import Submission
from arena.services.exceptions import SubmissionProcessingError
from arena.services.runner import run_submission_in_runner
from arena.services.scoring import read_score_result
from arena.services.zip_utils import safe_extract_submission

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Process queued submissions and score them."

    def add_arguments(self, parser):
        parser.add_argument(
            "--once",
            action="store_true",
            help="Process queued submissions until the queue is empty, then exit.",
        )
        parser.add_argument(
            "--sleep",
            type=int,
            default=settings.WORKER_POLL_INTERVAL_SECONDS,
            help="Polling interval in seconds when the queue is empty.",
        )

    def handle(self, *args, **options):
        if shutil.which("docker") is None:
            raise CommandError("docker CLI is required for the scoring worker.")

        Path(settings.RUNNER_JOBS_ROOT).mkdir(parents=True, exist_ok=True)
        logger.info("Scoring worker started once=%s", options["once"])

        if options["once"]:
            while self.process_next_submission():
                pass
            return

        sleep_seconds = max(options["sleep"], 1)
        while True:
            if not self.process_next_submission():
                time.sleep(sleep_seconds)

    def process_next_submission(self):
        submission = self.claim_next_submission()
        if not submission:
            return False

        self.process_submission(submission)
        return True

    def claim_next_submission(self):
        with transaction.atomic():
            submission = (
                Submission.objects.select_for_update(skip_locked=True)
                .filter(status=Submission.Status.QUEUED)
                .order_by("created_at", "id")
                .first()
            )
            if not submission:
                return None

            submission.status = Submission.Status.RUNNING
            submission.started_at = timezone.now()
            submission.finished_at = None
            submission.error_message = ""
            submission.save(
                update_fields=["status", "started_at", "finished_at", "error_message"]
            )
            return submission

    def process_submission(self, submission):
        job_root = Path(settings.RUNNER_JOBS_ROOT) / f"submission_{submission.pk}_{uuid.uuid4().hex}"
        workspace_dir = job_root / "workspace"
        output_dir = job_root / "output"

        try:
            artificial_delay = max(settings.WORKER_ARTIFICIAL_DELAY_SECONDS, 0)
            if artificial_delay:
                logger.info(
                    "Artificial processing delay submission=%s seconds=%s",
                    submission.pk,
                    artificial_delay,
                )
                time.sleep(artificial_delay)

            workspace_dir.mkdir(parents=True, exist_ok=True)
            output_dir.mkdir(parents=True, exist_ok=True)
            safe_extract_submission(Path(submission.uploaded_file.path), workspace_dir)
            run_submission_in_runner(workspace_dir, output_dir, submission.pk)
            score_result = read_score_result(output_dir / "score.json")

            submission.status = Submission.Status.DONE
            submission.score = score_result.score
            submission.error_message = ""
            submission.finished_at = timezone.now()
            submission.save(
                update_fields=["status", "score", "error_message", "finished_at"]
            )
            logger.info(
                "Submission scored submission=%s score=%s rows=%s",
                submission.pk,
                score_result.score,
                score_result.rows_scored,
            )
        except SubmissionProcessingError as exc:
            logger.warning("Submission failed submission=%s error=%s", submission.pk, exc)
            self.mark_failed(submission.pk, str(exc))
        except Exception:
            logger.exception("Unexpected submission failure submission=%s", submission.pk)
            self.mark_failed(
                submission.pk,
                "Internal scoring error. The incident has been logged.",
            )
        finally:
            shutil.rmtree(job_root, ignore_errors=True)

    def mark_failed(self, submission_id, message):
        Submission.objects.filter(pk=submission_id).update(
            status=Submission.Status.FAILED,
            error_message=message,
            finished_at=timezone.now(),
        )
