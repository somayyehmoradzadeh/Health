from django.contrib import admin
from .models import Case

@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "patient", "assignee", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("title", "patient__username", "patient__email")