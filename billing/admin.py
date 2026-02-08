from django.contrib import admin
from .models import Invoice

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("number", "case", "status", "currency", "total_amount", "created_at")
    list_filter = ("status", "currency", "created_at")
    search_fields = ("number", "case__title")