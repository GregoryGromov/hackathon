import uuid
from datetime import timedelta
from pathlib import Path

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models, transaction
from django.db.models import Max
from django.utils import timezone


def submission_upload_to(instance, filename):
    suffix = Path(filename).suffix.lower() or ".zip"
    date_path = timezone.now().strftime("%Y/%m/%d")
    return f"submissions/user_{instance.user_id}/{date_path}/{uuid.uuid4().hex}{suffix}"


class Submission(models.Model):
    class Status(models.TextChoices):
        QUEUED = "queued", "Queued"
        RUNNING = "running", "Running"
        DONE = "done", "Done"
        FAILED = "failed", "Failed"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="submissions",
    )
    user_submission_number = models.PositiveIntegerField()
    uploaded_file = models.FileField(upload_to=submission_upload_to)
    status = models.CharField(
        max_length=16,
        choices=Status.choices,
        default=Status.QUEUED,
        db_index=True,
    )
    score = models.DecimalField(max_digits=20, decimal_places=6, null=True, blank=True)
    is_public = models.BooleanField(
        default=True,
        help_text="If disabled, this submission is hidden from the leaderboard.",
    )
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at", "-id"]
        indexes = [
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["user", "created_at"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "user_submission_number"],
                name="unique_user_submission_number",
            )
        ]

    def __str__(self):
        return f"Submission #{self.pk} by {self.user}"

    def save(self, *args, **kwargs):
        if self._state.adding and not self.user_submission_number:
            if not self.user_id:
                raise ValueError("Submission.user must be set before save().")

            with transaction.atomic():
                get_user_model().objects.select_for_update().get(pk=self.user_id)
                max_number = (
                    type(self).objects.filter(user_id=self.user_id).aggregate(
                        max_number=Max("user_submission_number")
                    )["max_number"]
                    or 0
                )
                self.user_submission_number = max_number + 1
                return super().save(*args, **kwargs)

        return super().save(*args, **kwargs)

    @property
    def uploaded_filename(self):
        return Path(self.uploaded_file.name).name

    @property
    def uploaded_filename_short(self):
        filename = self.uploaded_filename
        path = Path(filename)
        stem = path.stem
        suffix = path.suffix

        if len(stem) <= 8:
            return filename

        return f"{stem[:4]}...{stem[-4:]}{suffix}"

    @property
    def is_terminal(self):
        return self.status in {self.Status.DONE, self.Status.FAILED}

    @property
    def status_badge_class(self):
        return {
            self.Status.QUEUED: "badge badge-muted",
            self.Status.RUNNING: "badge badge-warn",
            self.Status.DONE: "badge badge-success",
            self.Status.FAILED: "badge badge-danger",
        }[self.status]


class EmailVerificationToken(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="email_verification_tokens",
    )
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["token"], name="arena_email_token_990f2f_idx"),
            models.Index(fields=["user", "used_at"], name="arena_email_user_id_9f50b5_idx"),
        ]

    def __str__(self):
        return f"Email verification for {self.user}"

    @property
    def is_used(self):
        return self.used_at is not None

    @property
    def is_expired(self):
        expires_at = self.created_at + timedelta(hours=settings.EMAIL_VERIFICATION_TTL_HOURS)
        return timezone.now() > expires_at
