"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { apiFetch } from "@/lib/fetcher";
import { API_BASE } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Invoice = {
  id: string;
  case: string;
  currency: string;
  total_amount: string;
  status: string;
  created_at: string;
};

export default function InvoicesPage() {
  const [items, setItems] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);

  async function load() {
    const data = await apiFetch("/api/v1/invoices/");
    setItems(data);
  }

  useEffect(() => {
    setLoading(true);
    load()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function mockPay(invoiceId: string) {
    setPayingId(invoiceId);
    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/api/v1/mock/invoices/${invoiceId}/pay/`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(await res.text());
      await load();
    } finally {
      setPayingId(null);
    }
  }

  return (
    <RequireAuth>
      <AppShell>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Invoices</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and pay invoices (Mock payment for development)
            </p>
          </div>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No invoices yet.</p>
            ) : (
              <div className="space-y-3">
                {items.map((inv) => {
                  const paid = inv.status === "paid";
                  return (
                    <div
                      key={inv.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-2xl p-4 bg-background hover:shadow-sm transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">
                            {inv.currency} {inv.total_amount}
                          </div>
                          <Badge variant={paid ? "default" : "secondary"} className="rounded-full">
                            {inv.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(inv.created_at).toLocaleString()}
                        </div>
                        <div className="text-xs">
                          Case:{" "}
                          <Link className="underline" href={`/cases/${inv.case}`}>
                            Open case
                          </Link>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="rounded-2xl"
                          disabled={paid || payingId === inv.id}
                          onClick={() => mockPay(inv.id)}
                        >
                          {paid ? "Paid" : payingId === inv.id ? "Processing…" : "Pay (Mock)"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </AppShell>
    </RequireAuth>
  );
}