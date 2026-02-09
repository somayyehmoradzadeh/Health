"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { apiFetch } from "@/lib/fetcher";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Case = {
  id: string;
  title: string;
  status: string;
  created_at: string;
};

export default function CasesPage() {
  const [items, setItems] = useState<Case[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    apiFetch("/api/v1/cases/").then(setItems);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((c) => c.title.toLowerCase().includes(s) || c.status.toLowerCase().includes(s));
  }, [items, q]);

  return (
    <RequireAuth>
      <AppShell>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Cases</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Search and open case details
            </p>
          </div>

          <div className="w-full md:w-80">
            <Input
              placeholder="Search by title or status…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="rounded-2xl"
            />
          </div>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">No matching cases.</p>
            ) : (
              <div className="space-y-3">
                {filtered.map((c) => (
                  <Link
                    key={c.id}
                    href={`/cases/${c.id}`}
                    className="block border rounded-2xl p-4 bg-background hover:shadow-sm transition"
                  >
                    <div className="flex items-center justify-between">
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
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </AppShell>
    </RequireAuth>
  );
}