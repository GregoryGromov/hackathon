import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def env(name, default=None):
    return os.getenv(name, default)


def env_bool(name, default=False):
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def env_int(name, default):
    value = os.getenv(name)
    return int(value) if value is not None else default


def env_list(name, default=""):
    value = os.getenv(name, default)
    return [item.strip() for item in value.split(",") if item.strip()]


SECRET_KEY = env("SECRET_KEY", "dev-insecure-change-me")
DEBUG = env_bool("DEBUG", True)
ALLOWED_HOSTS = env_list("ALLOWED_HOSTS", "localhost,127.0.0.1,testserver")
CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS")
PUBLIC_BASE_URL = env("PUBLIC_BASE_URL", "")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "arena",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]

WSGI_APPLICATION = "config.wsgi.application"

if env_bool("USE_SQLITE", False) or not env("POSTGRES_DB"):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": env("POSTGRES_DB", "hackathon"),
            "USER": env("POSTGRES_USER", "hackathon"),
            "PASSWORD": env("POSTGRES_PASSWORD", "hackathon"),
            "HOST": env("POSTGRES_HOST", "postgres"),
            "PORT": env("POSTGRES_PORT", "5432"),
            "CONN_MAX_AGE": env_int("POSTGRES_CONN_MAX_AGE", 60),
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = env("TIME_ZONE", "UTC")
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
FILE_UPLOAD_PERMISSIONS = 0o600
FILE_UPLOAD_DIRECTORY_PERMISSIONS = 0o700
FILE_UPLOAD_MAX_MEMORY_SIZE = env_int("FILE_UPLOAD_MAX_MEMORY_SIZE", 5 * 1024 * 1024)

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

LOGIN_URL = "login"
LOGIN_REDIRECT_URL = "problem"
LOGOUT_REDIRECT_URL = "login"

SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"

SUBMISSION_MAX_UPLOAD_MB = env_int("SUBMISSION_MAX_UPLOAD_MB", 32)
SUBMISSION_MAX_UPLOAD_BYTES = SUBMISSION_MAX_UPLOAD_MB * 1024 * 1024
DATA_UPLOAD_MAX_MEMORY_SIZE = SUBMISSION_MAX_UPLOAD_BYTES + 1024 * 1024

ZIP_MAX_UNPACKED_MB = env_int("ZIP_MAX_UNPACKED_MB", 256)
ZIP_MAX_UNPACKED_BYTES = ZIP_MAX_UNPACKED_MB * 1024 * 1024
ZIP_MAX_FILES = env_int("ZIP_MAX_FILES", 2000)
ZIP_MAX_COMPRESSION_RATIO = env_int("ZIP_MAX_COMPRESSION_RATIO", 250)

RUNNER_IMAGE = env("RUNNER_IMAGE", "hackathon-runner:local")
RUNNER_IMAGE_ALLOWLIST = env_list("RUNNER_IMAGE_ALLOWLIST", RUNNER_IMAGE)
RUNNER_TIMEOUT_SECONDS = env_int("RUNNER_TIMEOUT_SECONDS", 3600)
RUNNER_CPUS = env("RUNNER_CPUS", "1")
RUNNER_MEMORY = env("RUNNER_MEMORY", "16g")
RUNNER_PIDS_LIMIT = env_int("RUNNER_PIDS_LIMIT", 256)
RUNNER_TMPFS_SIZE = env("RUNNER_TMPFS_SIZE", "64m")
RUNNER_USER = env("RUNNER_USER", "65534:65534")
RUNNER_STDIO_MAX_CHARS = env_int("RUNNER_STDIO_MAX_CHARS", 8000)
WORKER_POLL_INTERVAL_SECONDS = env_int("WORKER_POLL_INTERVAL_SECONDS", 5)
WORKER_ARTIFICIAL_DELAY_SECONDS = env_int("WORKER_ARTIFICIAL_DELAY_SECONDS", 0)

RESEND_API_KEY = env("RESEND_API_KEY", "")
RESEND_FROM_EMAIL = env("RESEND_FROM_EMAIL", "Reinforce Finance <onboarding@resend.dev>")
RESEND_TIMEOUT_SECONDS = env_int("RESEND_TIMEOUT_SECONDS", 10)
EMAIL_VERIFICATION_TTL_HOURS = env_int("EMAIL_VERIFICATION_TTL_HOURS", 48)

SHARED_ROOT = BASE_DIR / "shared"
RUNNER_JOBS_ROOT = SHARED_ROOT / "runner_jobs"
TEST_DATA_PATH = BASE_DIR / "datasets" / "test.parquet"
SCORING_TRUTH_PATH = BASE_DIR / "datasets" / "scoring_truth.csv"
TASK_DATA_DOWNLOAD_PATH = Path(env("TASK_DATA_DOWNLOAD_PATH", TEST_DATA_PATH))
TASK_DATA_DOWNLOAD_NAME = env("TASK_DATA_DOWNLOAD_NAME", "reinforce-market-action-data.parquet")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s %(levelname)s %(name)s %(message)s",
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
        }
    },
    "root": {
        "handlers": ["console"],
        "level": env("LOG_LEVEL", "INFO"),
    },
}
