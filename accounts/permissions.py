from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOperatorOrAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.role in ("operator", "admin"))


class IsCaseOwnerOrStaff(BasePermission):
    """
    - Patients: can access only their own cases
    - Operator/Admin: can access any case
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.role in ("operator", "admin"):
            return True
        return obj.patient_id == user.id