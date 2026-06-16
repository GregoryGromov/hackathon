from django.db import migrations, models


def populate_user_submission_numbers(apps, schema_editor):
    Submission = apps.get_model("arena", "Submission")
    user_counters = {}

    submissions = Submission.objects.order_by("user_id", "created_at", "id")
    for submission in submissions.iterator():
        next_number = user_counters.get(submission.user_id, 0) + 1
        user_counters[submission.user_id] = next_number
        Submission.objects.filter(pk=submission.pk).update(
            user_submission_number=next_number
        )


class Migration(migrations.Migration):

    dependencies = [
        ("arena", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="submission",
            name="user_submission_number",
            field=models.PositiveIntegerField(null=True),
        ),
        migrations.RunPython(
            populate_user_submission_numbers, migrations.RunPython.noop
        ),
        migrations.AlterField(
            model_name="submission",
            name="user_submission_number",
            field=models.PositiveIntegerField(),
        ),
        migrations.AddConstraint(
            model_name="submission",
            constraint=models.UniqueConstraint(
                fields=("user", "user_submission_number"),
                name="unique_user_submission_number",
            ),
        ),
    ]
