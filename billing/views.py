from rest_framework import viewsets, permissions
from accounts.permissions import IsCaseOwnerOrStaff
from .models import Invoice
from .serializers import InvoiceSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsCaseOwnerOrStaff]

    def get_queryset(self):
        user = self.request.user
        qs = Invoice.objects.select_related("case", "case__patient").all()
        if user.role in ("operator", "admin"):
            return qs
        return qs.filter(case__patient=user)

    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj.case)
        return obj