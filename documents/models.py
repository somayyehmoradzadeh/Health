import uuid
from django.db import models
from cases.models import Case


class DocumentType(models.TextChoices):
    PASSPORT = "passport", "Passport"
    LAB = "lab", "Lab results"
    MRI = "mri", "MRI/CT"
    OTHER = "other", "Other"


def case_upload_path(instance, filename: str) -> str:
    return f"cases/{instance.case_id}/{instance.doc_type}/{filename}"


class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name="documents")
    doc_type = models.CharField(max_length=20, choices=DocumentType.choices, default=DocumentType.OTHER)
    title = models.CharField(max_length=200, blank=True, default="")

    file = models.FileField(upload_to=case_upload_path)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title or f"{self.doc_type}"