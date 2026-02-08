"""
URL configuration for Backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from accounts.views import RegisterAPIView
from django.contrib import admin
from django.urls import path, include
from billing.views_mock import MockPayInvoiceAPIView
from billing.views_paypal import PayPalCreateOrderAPIView, PayPalCaptureOrderAPIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from cases.views_summary import DashboardSummaryAPIView, OverviewAPIView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("Backend.api_urls")),
    path("api/v1/paypal/invoices/<uuid:invoice_id>/create-order/", PayPalCreateOrderAPIView.as_view()),
    path("api/v1/paypal/invoices/<uuid:invoice_id>/capture/", PayPalCaptureOrderAPIView.as_view()),
    path("api/v1/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/v1/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path("api/v1/mock/invoices/<uuid:invoice_id>/pay/", MockPayInvoiceAPIView.as_view()),

    path("api/v1/auth/register/", RegisterAPIView.as_view(), name="auth_register"),
    path("api/v1/summary/", DashboardSummaryAPIView.as_view(), name="dashboard_summary"),
    path("api/v1/overview/", OverviewAPIView.as_view(), name="overview"),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
