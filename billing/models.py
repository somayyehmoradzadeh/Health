import uuid
from decimal import Decimal
from django.db import models
from cases.models import Case


class Currency(models.TextChoices):
    EUR = "EUR", "EUR"
    USD = "USD", "USD"
    GBP = "GBP", "GBP"


class InvoiceStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    ISSUED = "issued", "Issued"
    PAID = "paid", "Paid"
    CANCELLED = "cancelled", "Cancelled"


class Invoice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name="invoices")

    number = models.CharField(max_length=30, unique=True)
    status = models.CharField(max_length=20, choices=InvoiceStatus.choices, default=InvoiceStatus.DRAFT)

    currency = models.CharField(max_length=3, choices=Currency.choices, default=Currency.EUR)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))

    # PayPal order/capture ids (در مرحله پرداخت پر می‌شود)
    paypal_order_id = models.CharField(max_length=120, blank=True, default="")
    paypal_capture_id = models.CharField(max_length=120, blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.number