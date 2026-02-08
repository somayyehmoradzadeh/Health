from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404

from accounts.permissions import IsCaseOwnerOrStaff
from billing.models import Invoice, InvoiceStatus


class MockPayInvoiceAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, invoice_id):
        invoice = get_object_or_404(Invoice.objects.select_related("case", "case__patient"), id=invoice_id)

        # permission check based on related case
        if not IsCaseOwnerOrStaff().has_object_permission(request, self, invoice.case):
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

        invoice.status = InvoiceStatus.PAID
        invoice.save(update_fields=["status"])

        # optional: update case status
        case = invoice.case
        case.status = "paid"
        case.save(update_fields=["status"])

        return Response({"invoice_id": str(invoice.id), "status": invoice.status}, status=status.HTTP_200_OK)