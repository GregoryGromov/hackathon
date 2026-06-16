import logging

from django.contrib import messages
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.db.models import Max, Min
from django.http import FileResponse, Http404, HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils import timezone

from .forms import RegistrationForm, SubmissionUploadForm
from .models import EmailVerificationToken, Submission

logger = logging.getLogger(__name__)


def format_file_size(size_bytes: int) -> str:
    units = ("B", "KB", "MB", "GB")
    size = float(size_bytes)
    for unit in units:
        if size < 1024 or unit == units[-1]:
            return f"{size:.1f} {unit}" if unit != "B" else f"{int(size)} {unit}"
        size /= 1024
    return f"{size_bytes} B"


def build_leaderboard_rows(current_user):
    rows = list(
        Submission.objects.filter(status=Submission.Status.DONE, is_public=True)
        .values("user_id", "user__username")
        .annotate(best_score=Max("score"), first_finish_at=Min("finished_at"))
        .order_by("-best_score", "first_finish_at", "user__username")
    )

    current_user_place = None
    for index, row in enumerate(rows, start=1):
        row["rank"] = index
        if current_user.is_authenticated and row["user_id"] == current_user.id:
            current_user_place = index
    return rows, current_user_place


def build_about_context():
    return {
        "challenge_name": "Reinforce.fi Challenge: Market-Action Arena",
        "challenge_summary": (
            "A quant and machine-learning challenge focused on selecting the most "
            "profitable market action from anonymized market-state data."
        ),
        "organizer_summary": (
            "Reinforce.fi, formerly Overnight.fi, helps businesses in emerging markets "
            "earn more on idle USDT liquidity with transparent, automated yield "
            "strategies and simple withdrawals."
        ),
        "timeline_summary": (
            "Kickoff is planned for late June 2026. The challenge is expected to run "
            "for roughly 1.5 to 2 months, with exact milestones announced separately."
        ),
        "participation_summary": "Participants join as solo competitors.",
        "prizes": [
            {"place": "1st place", "amount": "2,500 USD"},
            {"place": "2nd place", "amount": "1,500 USD"},
            {"place": "3rd place", "amount": "1,000 USD"},
        ],
    }


def register_view(request: HttpRequest) -> HttpResponse:
    if request.user.is_authenticated:
        return redirect("problem")

    form = RegistrationForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        with transaction.atomic():
            user = form.save()
        messages.success(request, "Account created. You can sign in now.")
        return redirect("login")
    return render(request, "registration/register.html", {"form": form})


def confirm_email_view(request: HttpRequest, token) -> HttpResponse:
    verification = get_object_or_404(
        EmailVerificationToken.objects.select_related("user"),
        token=token,
    )

    if verification.is_used:
        messages.info(request, "Email is already confirmed. You can sign in.")
        return redirect("login")

    if verification.is_expired:
        messages.error(request, "Confirmation link has expired. Register again or contact support.")
        return redirect("login")

    verification.user.is_active = True
    verification.user.save(update_fields=["is_active"])
    verification.used_at = timezone.now()
    verification.save(update_fields=["used_at"])
    messages.success(request, "Email confirmed. You can sign in now.")
    return redirect("login")


@login_required
def problem_view(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        form = SubmissionUploadForm(request.POST, request.FILES)
        if form.is_valid():
            with transaction.atomic():
                submission = form.save(commit=False)
                submission.user = request.user
                submission.status = Submission.Status.QUEUED
                submission.save()
            return redirect(f"{reverse('problem')}?tab=submissions")
    else:
        form = SubmissionUploadForm()

    submissions = Submission.objects.filter(user=request.user).select_related("user")
    leaderboard_rows, current_user_place = build_leaderboard_rows(request.user)
    task_data_path = settings.TASK_DATA_DOWNLOAD_PATH
    task_data_size = (
        format_file_size(task_data_path.stat().st_size)
        if task_data_path.is_file()
        else None
    )
    return render(
        request,
        "arena/problem.html",
        {
            "form": form,
            "submissions": submissions,
            "leaderboard_rows": leaderboard_rows[:10],
            "current_user_place": current_user_place,
            "submission_max_upload_mb": settings.SUBMISSION_MAX_UPLOAD_MB,
            "task_data_download_name": settings.TASK_DATA_DOWNLOAD_NAME,
            "task_data_download_size": task_data_size,
        },
    )


@login_required
def about_view(request: HttpRequest) -> HttpResponse:
    return render(request, "arena/about.html", build_about_context())


@login_required
def task_data_download_view(request: HttpRequest) -> FileResponse:
    data_path = settings.TASK_DATA_DOWNLOAD_PATH
    if not data_path.is_file():
        raise Http404("Task dataset is not available.")

    return FileResponse(
        data_path.open("rb"),
        as_attachment=True,
        filename=settings.TASK_DATA_DOWNLOAD_NAME,
        content_type="application/octet-stream",
    )


@login_required
def submission_status_view(request: HttpRequest, pk: int) -> HttpResponse:
    submission = get_object_or_404(Submission.objects.select_related("user"), pk=pk)
    if submission.user_id != request.user.id and not request.user.is_staff:
        raise Http404
    return render(request, "arena/_submission_row.html", {"submission": submission})


@login_required
def leaderboard_preview_view(request: HttpRequest) -> HttpResponse:
    leaderboard_rows, current_user_place = build_leaderboard_rows(request.user)
    return render(
        request,
        "arena/_leaderboard_preview.html",
        {
            "leaderboard_rows": leaderboard_rows[:10],
            "current_user_place": current_user_place,
        },
    )


@login_required
def leaderboard_view(request: HttpRequest) -> HttpResponse:
    leaderboard_rows, current_user_place = build_leaderboard_rows(request.user)
    return render(
        request,
        "arena/leaderboard.html",
        {
            "leaderboard_rows": leaderboard_rows,
            "current_user_place": current_user_place,
        },
    )
