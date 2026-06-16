from django.contrib import admin
from django.http import FileResponse, Http404
from django.urls import path, reverse
from django.utils import timezone
from django.utils.html import format_html

from .models import EmailVerificationToken, Submission


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user_submission_number",
        "user",
        "user_email",
        "status",
        "score",
        "is_public",
        "created_at",
        "duration",
        "download_zip",
    )
    list_filter = ("status", "is_public", "created_at", "finished_at")
    search_fields = ("user__username", "user__email", "uploaded_file", "error_message")
    readonly_fields = (
        "created_at",
        "started_at",
        "finished_at",
        "download_zip",
        "duration",
    )
    actions = ("rerun_submissions", "hide_from_leaderboard", "show_on_leaderboard")

    @admin.display(description="Email")
    def user_email(self, obj):
        return obj.user.email

    @admin.display(description="Duration")
    def duration(self, obj):
        if not obj.started_at:
            return "-"
        finished_at = obj.finished_at or timezone.now()
        seconds = int((finished_at - obj.started_at).total_seconds())
        return f"{seconds}s"

    @admin.display(description="ZIP")
    def download_zip(self, obj):
        if not obj.pk or not obj.uploaded_file:
            return "-"
        url = reverse("admin:arena_submission_download", args=[obj.pk])
        return format_html('<a href="{}">Download</a>', url)

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "<int:object_id>/download/",
                self.admin_site.admin_view(self.download_view),
                name="arena_submission_download",
            ),
        ]
        return custom_urls + urls

    def download_view(self, request, object_id):
        submission = self.get_object(request, object_id)
        if not submission or not submission.uploaded_file:
            raise Http404("Submission file not found.")
        return FileResponse(
            submission.uploaded_file.open("rb"),
            as_attachment=True,
            filename=submission.uploaded_filename,
            content_type="application/zip",
        )

    @admin.action(description="Rerun selected submissions")
    def rerun_submissions(self, request, queryset):
        updated = queryset.exclude(status=Submission.Status.RUNNING).update(
            status=Submission.Status.QUEUED,
            score=None,
            error_message="",
            started_at=None,
            finished_at=None,
        )
        self.message_user(request, f"{updated} submission(s) queued for rerun.")

    @admin.action(description="Hide selected from leaderboard")
    def hide_from_leaderboard(self, request, queryset):
        updated = queryset.update(is_public=False)
        self.message_user(request, f"{updated} submission(s) hidden from leaderboard.")

    @admin.action(description="Show selected on leaderboard")
    def show_on_leaderboard(self, request, queryset):
        updated = queryset.update(is_public=True)
        self.message_user(request, f"{updated} submission(s) shown on leaderboard.")


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at", "used_at")
    list_filter = ("created_at", "used_at")
    search_fields = ("user__username", "user__email")
    readonly_fields = ("token", "created_at", "used_at")
