from django import forms
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.core.exceptions import ValidationError

from .models import Submission

User = get_user_model()


class RegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    username = forms.CharField(
        label="Display name",
        max_length=150,
        help_text="This name is visible on the leaderboard.",
    )

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "email")

    def clean_email(self):
        email = self.cleaned_data["email"].strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise ValidationError("A user with this email already exists.")
        return email

    def clean_username(self):
        username = self.cleaned_data["username"].strip()
        if User.objects.filter(username__iexact=username).exists():
            raise ValidationError("This display name is already taken.")
        return username

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]
        user.is_active = True
        if commit:
            user.save()
        return user


class SubmissionUploadForm(forms.ModelForm):
    uploaded_file = forms.FileField(
        label="Solution ZIP",
        widget=forms.ClearableFileInput(attrs={"accept": ".zip"}),
    )

    class Meta:
        model = Submission
        fields = ("uploaded_file",)

    def clean_uploaded_file(self):
        uploaded_file = self.cleaned_data["uploaded_file"]
        if not uploaded_file.name.lower().endswith(".zip"):
            raise ValidationError("Only .zip archives are accepted.")
        if uploaded_file.size > settings.SUBMISSION_MAX_UPLOAD_BYTES:
            raise ValidationError(
                f"Archive is too large. Max size is {settings.SUBMISSION_MAX_UPLOAD_MB} MB."
            )
        return uploaded_file


class EmailAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(label="Email")

    def clean(self):
        email = self.cleaned_data.get("username")
        password = self.cleaned_data.get("password")

        if email is not None and password:
            email = email.strip().lower()
            try:
                user = User.objects.get(email__iexact=email)
            except (User.DoesNotExist, User.MultipleObjectsReturned):
                user = None

            username = user.get_username() if user else email
            self.user_cache = authenticate(
                self.request,
                username=username,
                password=password,
            )

            if self.user_cache is None:
                raise self.get_invalid_login_error()
            self.confirm_login_allowed(self.user_cache)

        return self.cleaned_data
