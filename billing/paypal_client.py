import os
import base64
import requests


class PayPalClient:
    def __init__(self):
        env = os.getenv("PAYPAL_ENV", "sandbox").lower()
        self.base_url = "https://api-m.sandbox.paypal.com" if env == "sandbox" else "https://api-m.paypal.com"
        self.client_id = os.getenv("PAYPAL_CLIENT_ID", "")
        self.client_secret = os.getenv("PAYPAL_CLIENT_SECRET", "")

    def _basic_auth_header(self) -> str:
        token = base64.b64encode(f"{self.client_id}:{self.client_secret}".encode()).decode()
        return f"Basic {token}"

    def get_access_token(self) -> str:
        url = f"{self.base_url}/v1/oauth2/token"
        headers = {
            "Authorization": self._basic_auth_header(),
            "Content-Type": "application/x-www-form-urlencoded",
        }
        data = {"grant_type": "client_credentials"}
        r = requests.post(url, headers=headers, data=data, timeout=20)
        r.raise_for_status()
        return r.json()["access_token"]

    def create_order(self, *, access_token: str, invoice_id: str, currency: str, amount: str, return_url: str, cancel_url: str):
        url = f"{self.base_url}/v2/checkout/orders"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }
        payload = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "reference_id": str(invoice_id),
                    "amount": {"currency_code": currency, "value": amount},
                }
            ],
            "application_context": {
                "return_url": return_url,
                "cancel_url": cancel_url,
                "brand_name": "Medical Travel",
                "user_action": "PAY_NOW",
            },
        }
        r = requests.post(url, headers=headers, json=payload, timeout=20)
        r.raise_for_status()
        return r.json()

    def capture_order(self, *, access_token: str, order_id: str):
        url = f"{self.base_url}/v2/checkout/orders/{order_id}/capture"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }
        r = requests.post(url, headers=headers, json={}, timeout=20)
        r.raise_for_status()
        return r.json()