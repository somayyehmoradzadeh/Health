
from django.db.models import Count, Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from cases.models import Case
from documents.models import Document
from billing.models import Invoice



class DashboardSummaryAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Case.objects.all().select_related("patient")

        if not request.user.is_staff:
            qs = qs.filter(patient=request.user)

        total_cases = qs.count()
        by_status = list(qs.values("status").annotate(count=Count("id")).order_by("status"))

        recent = qs.order_by("-created_at")[:5]
        recent_cases = [
            {
                "id": str(c.id),
                "title": c.title,
                "status": c.status,
                "created_at": c.created_at,
            }
            for c in recent
        ]

        return Response(
            {
                "total_cases": total_cases,
                "by_status": by_status,
                "recent_cases": recent_cases,
            }
        )




class OverviewAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # base querysets
        case_qs = Case.objects.all()
        doc_qs = Document.objects.select_related("case")
        inv_qs = Invoice.objects.select_related("case")

        if not user.is_staff:
            case_qs = case_qs.filter(patient=user)
            doc_qs = doc_qs.filter(case__patient=user)
            inv_qs = inv_qs.filter(case__patient=user)

        total_cases = case_qs.count()
        by_status = list(case_qs.values("status").annotate(count=Count("id")).order_by("status"))

        total_docs = doc_qs.count()
        recent_docs = doc_qs.order_by("-created_at")[:5]
        recent_docs_payload = [
            {
                "id": str(d.id),
                "title": d.title or d.doc_type,
                "doc_type": d.doc_type,
                "case_id": str(d.case_id),
                "created_at": d.created_at,
            }
            for d in recent_docs
        ]

        # invoices
        unpaid = inv_qs.exclude(status="paid")  # اگر enum داری، عوضش کن
        unpaid_count = unpaid.count()
        unpaid_total = unpaid.aggregate(s=Sum("total_amount"))["s"] or 0

        recent_invoices = inv_qs.order_by("-created_at")[:5]
        recent_invoices_payload = [
            {
                "id": str(i.id),
                "case_id": str(i.case_id),
                "status": i.status,
                "currency": i.currency,
                "total_amount": str(i.total_amount),
                "created_at": i.created_at,
            }
            for i in recent_invoices
        ]

        recent_cases = case_qs.order_by("-created_at")[:5]
        recent_cases_payload = [
            {
                "id": str(c.id),
                "title": c.title,
                "status": c.status,
                "created_at": c.created_at,
            }
            for c in recent_cases
        ]

        return Response(
            {
                "total_cases": total_cases,
                "cases_by_status": by_status,
                "total_documents": total_docs,
                "recent_documents": recent_docs_payload,
                "unpaid_invoices_count": unpaid_count,
                "unpaid_invoices_total": str(unpaid_total),
                "recent_invoices": recent_invoices_payload,
                "recent_cases": recent_cases_payload,
                "user": {"username": user.username, "is_staff": user.is_staff},
            }
        )
