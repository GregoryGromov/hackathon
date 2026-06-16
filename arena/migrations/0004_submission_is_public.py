from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("arena", "0003_emailverificationtoken"),
    ]

    operations = [
        migrations.AddField(
            model_name="submission",
            name="is_public",
            field=models.BooleanField(
                default=True,
                help_text="If disabled, this submission is hidden from the leaderboard.",
            ),
        ),
    ]
