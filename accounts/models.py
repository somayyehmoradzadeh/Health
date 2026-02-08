import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRole(models.TextChoices):
    PATIENT = "patient", "Patient"
    OPERATOR = "operator", "Operator"
    ADMIN = "admin", "Admin"


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.PATIENT)