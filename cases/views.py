from rest_framework import viewsets, permissions
from accounts.permissions import IsCaseOwnerOrStaff
from .models import Case
from .serializers import CaseSerializer


class CaseViewSet(viewsets.ModelViewSet):
    serializer_class = CaseSerializer
    permission_classes = [permissions.IsAuthenticated, IsCaseOwnerOrStaff]

    def get_queryset(self):
        user = self.request.user
        qs = Case.objects.select_related("patient", "assignee").all()
        if user.role in ("operator", "admin"):
            return qs
        return qs.filter(patient=user)

    def perform_create(self, serializer):
        user = self.request.user
        # Patients create cases for themselves by default
        if user.role == "patient":
            serializer.save(patient=user)
        else:
            serializer.save()