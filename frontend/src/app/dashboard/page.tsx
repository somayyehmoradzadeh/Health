"use client";

import { useEffect, useState } from "react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { apiFetch } from "@/lib/fetcher";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Case = {
  id: string;
  title: string;
  status: string;
  created_at: string;
};

export default function DashboardPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/v1/cases/")
      .then(setCases)
      .finally(() => setLoading(false));
  }, []);

  return (
    <RequireAuth>
      <AppShell>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Overview of your most recent cases
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">Total cases</div>
              <div className="text-3xl font-semibold mt-2">{cases.length}</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="text-base font-medium mt-2">Operational</div>
              <div className="text-xs text-muted-foreground mt-1">
                Auth + API connected
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">Next step</div>
              <div className="text-base font-medium mt-2">Cases page</div>
              <div className="text-xs text-muted-foreground mt-1">
                Search, filters, details, documents
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold">Recent cases</div>
                <div className="text-xs text-muted-foreground">
                  Latest created items
                </div>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : cases.length === 0 ? (
              <p className="text-sm text-muted-foreground">No cases yet.</p>
            ) : (
              <div className="space-y-3">
                {cases.slice(0, 8).map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between border rounded-2xl p-4 bg-background hover:shadow-sm transition"
                  >
                    <div>
                      <div className="font-medium">{c.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(c.created_at).toLocaleString()}
                      </div>
                    </div>
                    <Badge variant="secondary" className="rounded-full">
                      {c.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </AppShell>
    </RequireAuth>
  );
}