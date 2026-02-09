"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { API_BASE } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Case = {
  id: string;
  title: string;
  status: string;
  notes: string;
};

type Document = {
  id: string;
  case: string;
  doc_type: string;
  title: string;
  file: string;
  created_at: string;
};

export default function CaseDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [item, setItem] = useState<Case | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const [docType, setDocType] = useState("other");
  const [docTitle, setDocTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function loadAll() {
    const token = getAccessToken();
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
    const [c, d] = await Promise.all([
      fetch(`${API_BASE}/api/v1/cases/${id}/`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/api/v1/documents/`, { headers }).then((r) => r.json()),
    ]);
    setItem(c);
    setDocs((d ?? []).filter((x: Document) => x.case === id));
  }

  useEffect(() => {
    setLoading(true);
    loadAll()
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function upload() {
    setErr(null);
    if (!file) {
      setErr("Select a file first.");
      return;
    }
    setUploading(true);
    try {
      const token = getAccessToken();
      const form = new FormData();
      form.append("case", id);
      form.append("doc_type", docType);
      form.append("title", docTitle);
      form.append("file", file);

      const res = await fetch(`${API_BASE}/api/v1/documents/`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      });

      if (!res.ok) throw new Error(await res.text());
      setDocTitle("");
      setFile(null);
      await loadAll();
    } catch (e: any) {
      setErr("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <RequireAuth>
      <AppShell>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !item ? (
          <p className="text-sm text-muted-foreground">Case not found.</p>
        ) : (
          <div className="space-y-6">
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold">{item.title}</h1>
                    <p className="text-sm text-muted-foreground mt-1">{item.notes || "—"}</p>
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    {item.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="font-semibold">Upload document</div>
                  <div className="text-xs text-muted-foreground">Attach passport, lab results, MRI, etc.</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Input value={docType} onChange={(e) => setDocType(e.target.value)} className="rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={docTitle} onChange={(e) => setDocTitle(e.target.value)} className="rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>File</Label>
                    <Input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="rounded-2xl"
                    />
                  </div>
                </div>

                {err && <p className="text-sm text-red-600">{err}</p>}

                <Button className="rounded-2xl" onClick={upload} disabled={uploading}>
                  {uploading ? "Uploading…" : "Upload"}
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <div className="font-semibold mb-3">Documents</div>
                {docs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No documents yet.</p>
                ) : (
                  <div className="space-y-3">
                    {docs.map((d) => (
                      <a
                        key={d.id}
                        href={d.file}
                        target="_blank"
                        className="block border rounded-2xl p-4 bg-background hover:shadow-sm transition"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{d.title || d.doc_type}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(d.created_at).toLocaleString()}
                            </div>
                          </div>
                          <Badge variant="secondary" className="rounded-full">
                            {d.doc_type}
                          </Badge>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </AppShell>
    </RequireAuth>
  );
}