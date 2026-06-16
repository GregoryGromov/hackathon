import json
import logging
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings
from django.urls import reverse

from arena.models import EmailVerificationToken

logger = logging.getLogger(__name__)


class EmailDeliveryError(Exception):
    pass


def build_confirmation_url(request, token: EmailVerificationToken) -> str:
    path = reverse("confirm-email", kwargs={"token": token.token})
    if settings.PUBLIC_BASE_URL:
        return f"{settings.PUBLIC_BASE_URL.rstrip('/')}{path}"
    return request.build_absolute_uri(path)


def send_verification_email(user, confirmation_url: str):
    if not settings.RESEND_API_KEY:
        if settings.DEBUG:
            logger.warning("RESEND_API_KEY is not set. Confirmation URL: %s", confirmation_url)
            return
        raise EmailDeliveryError("Email service is not configured.")

    payload = {
        "from": settings.RESEND_FROM_EMAIL,
        "to": [user.email],
        "subject": "Confirm your Reinforce Finance account",
        "html": (
            "<p>Confirm your email to activate your Reinforce Finance account.</p>"
            f'<p><a href="{confirmation_url}">Confirm email</a></p>'
            f"<p>If the button does not work, open this link: {confirmation_url}</p>"
        ),
        "text": (
            "Confirm your email to activate your Reinforce Finance account.\n\n"
            f"{confirmation_url}"
        ),
    }
    request = Request(
        "https://api.resend.com/emails",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=settings.RESEND_TIMEOUT_SECONDS) as response:
            if response.status >= 300:
                raise EmailDeliveryError(f"Resend returned HTTP {response.status}.")
    except HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        logger.warning("Resend HTTP error status=%s body=%s", exc.code, body)
        raise EmailDeliveryError("Could not send confirmation email.") from exc
    except URLError as exc:
        logger.warning("Resend connection error: %s", exc)
        raise EmailDeliveryError("Could not connect to email service.") from exc
