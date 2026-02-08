import uuid
from django.conf import settings
from django.db import models


class CaseStatus(models.TextChoices):
    NEW = "new", "New"
    IN_REVIEW = "in_review", "In review"
    QUOTE_SENT = "quote_sent", "Quote sent"
    PAID = "paid", "Paid"
    IN_PROGRESS = "in_progress", "In progress"
    COMPLETED = "completed", "Completed"
    CANCELLED = "cancelled", "Cancelled"


class Case(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)


    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cases",
    )


    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_cases",
    )

    title = models.CharField(max_length=200)
    status = models.CharField(
        max_length=20,
        choices=CaseStatus.choices,
        default=CaseStatus.NEW,
    )

    phone = models.CharField(max_length=50, blank=True, default="")
    country = models.CharField(max_length=100, blank=True, default="")

    notes = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.title} ({self.status})"