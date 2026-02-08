import os
from decimal import Decimal
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from accounts.permissions import IsCaseOwnerOrStaff
from billing.models import Invoice, InvoiceStatus
from billing.paypal_client import PayPalClient


class PayPalCreateOrderAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, invoice_id):
        invoice = get_object_or_404(Invoice.objects.select_related("case", "case__patient"), id=invoice_id)
        # object-level permission via case
        IsCaseOwnerOrStaff().has_object_permission(request, self, invoice.case) or self.permission_denied(request)

        if invoice.status not in (InvoiceStatus.ISSUED, InvoiceStatus.DRAFT):
            return Response({"detail": "Invoice is not payable."}, status=status.HTTP_400_BAD_REQUEST)

        if Decimal(invoice.total_amount) <= 0:
            return Response({"detail": "Invoice amount must be > 0."}, status=status.HTTP_400_BAD_REQUEST)

        client = PayPalClient()
        access_token = client.get_access_token()

        return_url = os.getenv("PAYPAL_RETURN_URL", "http://localhost:3000/paypal/return")
        cancel_url = os.getenv("PAYPAL_CANCEL_URL", "http://localhost:3000/paypal/cancel")

        order = client.create_order(
            access_token=access_token,
            invoice_id=str(invoice.id),
            currency=invoice.currency,
            amount=str(invoice.total_amount),
            return_url=return_url,
            cancel_url=cancel_url,
        )

        invoice.paypal_order_id = order["id"]
        invoice.status = InvoiceStatus.ISSUED
        invoice.save(update_fields=["paypal_order_id", "status"])

        approve_link = None
        for link in order.get("links", []):
            if link.get("rel") == "approve":
                approve_link = link.get("href")
                break

        return Response(
            {"paypal_order_id": order["id"], "approve_url": approve_link},
            status=status.HTTP_201_CREATED,
        )


class PayPalCaptureOrderAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, invoice_id):
        invoice = get_object_or_404(Invoice.objects.select_related("case", "case__patient"), id=invoice_id)
        IsCaseOwnerOrStaff().has_object_permission(request, self, invoice.case) or self.permission_denied(request)

        if not invoice.paypal_order_id:
            return Response({"detail": "No PayPal order for this invoice."}, status=status.HTTP_400_BAD_REQUEST)

        client = PayPalClient()
        access_token = client.get_access_token()
        capture = client.capture_order(access_token=access_token, order_id=invoice.paypal_order_id)

        # best-effort: mark paid if capture completed
        capture_id = ""
        try:
            purchase_units = capture.get("purchase_units", [])
            payments = purchase_units[0].get("payments", {})
            captures = payments.get("captures", [])
            capture_id = captures[0].get("id", "")
            capture_status = captures[0].get("status", "")
        except Exception:
            capture_status = ""

        if capture_status == "COMPLETED":
            invoice.status = InvoiceStatus.PAID
            invoice.paypal_capture_id = capture_id
            invoice.save(update_fields=["status", "paypal_capture_id"])
            # optionally update case status
            case = invoice.case
            case.status = "paid"
            case.save(update_fields=["status"])

        return Response(
            {"paypal_order_id": invoice.paypal_order_id, "capture": capture, "invoice_status": invoice.status},
            status=status.HTTP_200_OK,
        )