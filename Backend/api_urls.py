from rest_framework.routers import DefaultRouter
from cases.views import CaseViewSet
from documents.views import DocumentViewSet
from billing.views import InvoiceViewSet

router = DefaultRouter()
router.register(r"cases", CaseViewSet, basename="cases")
router.register(r"documents", DocumentViewSet, basename="documents")
router.register(r"invoices", InvoiceViewSet, basename="invoices")

urlpatterns = router.urls