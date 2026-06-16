from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path

from .forms import EmailAuthenticationForm
from .views import (
    about_view,
    confirm_email_view,
    leaderboard_preview_view,
    leaderboard_view,
    problem_view,
    register_view,
    submission_status_view,
    task_data_download_view,
)

urlpatterns = [
    path("", problem_view, name="problem"),
    path("about/", about_view, name="about"),
    path("task/data/", task_data_download_view, name="task-data-download"),
    path("leaderboard/", leaderboard_view, name="leaderboard"),
    path("leaderboard/preview/", leaderboard_preview_view, name="leaderboard-preview"),
    path("submissions/<int:pk>/status/", submission_status_view, name="submission-status"),
    path(
        "accounts/login/",
        LoginView.as_view(
            template_name="registration/login.html",
            authentication_form=EmailAuthenticationForm,
        ),
        name="login",
    ),
    path("accounts/logout/", LogoutView.as_view(), name="logout"),
    path("accounts/register/", register_view, name="register"),
    path("accounts/confirm/<uuid:token>/", confirm_email_view, name="confirm-email"),
]
