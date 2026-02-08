from django.contrib import admin
from .models import Document

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("case", "doc_type", "title", "created_at")
    list_filter = ("doc_type", "created_at")
    search_fields = ("title", "case__title")