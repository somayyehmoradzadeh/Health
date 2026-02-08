from rest_framework import viewsets, permissions
from accounts.permissions import IsCaseOwnerOrStaff
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Document
from .serializers import DocumentSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated, IsCaseOwnerOrStaff]

    def get_queryset(self):
        user = self.request.user
        qs = Document.objects.select_related("case", "case__patient").all()
        if user.role in ("operator", "admin"):
            return qs
        return qs.filter(case__patient=user)

    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj.case)
        return obj


from rest_framework.parsers import MultiPartParser, FormParser