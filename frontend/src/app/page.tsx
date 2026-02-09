"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {getAccessToken} from "@/lib/auth";
import {apiFetch} from "@/lib/fetcher";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

const features = [
    {title: "Case Management", desc: "Track cases with clean statuses and ownership."},
    {title: "Secure Documents", desc: "Upload medical documents per case."},
    {title: "Invoices & Payments", desc: "Manage billing flow (mock now, PayPal later)."},
    {title: "Role-based Access", desc: "Patient / Operator / Admin permissions."},
];


type Overview = {
    user: { username: string; is_staff: boolean };
    total_cases: number;
    cases_by_status: { status: string; count: number }[];
    total_documents: number;
    recent_documents: { id: string; title: string; doc_type: string; case_id: string; created_at: string }[];
    unpaid_invoices_count: number;
    unpaid_invoices_total: string;
    recent_invoices: {
        id: string;
        case_id: string;
        status: string;
        currency: string;
        total_amount: string;
        created_at: string
    }[];
    recent_cases: { id: string; title: string; status: string; created_at: string }[];
};
export default function HomePage() {
    const [token, setToken] = useState<string | null>(null);
    const [overview, setOverview] = useState<Overview | null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const t = getAccessToken();
        setToken(t);

        if (!t) return;

        setLoading(true);
        apiFetch("/api/v1/overview/")
            .then(setOverview)
            .catch(() => setOverview(null))
            .finally(() => setLoading(false));
    }, []);


    return (
        <div className="min-h-screen bg-background">
            {/* background */}
            <div className="absolute inset-0 -z-10">
                <div
                    className="h-full w-full bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.14),transparent_55%)]"/>
                <div
                    className="h-full w-full bg-grid-slate-200/40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"/>
            </div>

            {/* top bar */}
            <header className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div
                        className="h-9 w-9 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">MT</span>
                    </div>
                    <div className="leading-tight">
                        <div className="font-semibold">Medical Travel</div>
                        <div className="text-xs text-muted-foreground">Case Management</div>
                    </div>
                </Link>

                <nav className="flex items-center gap-2">
                    {token ? (
                        <>
                            <Link href="/dashboard">
                                <Button variant="outline" className="rounded-2xl">
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/cases">
                                <Button className="rounded-2xl">Cases</Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" className="rounded-2xl">
                                    Sign in
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="rounded-2xl">Create account</Button>
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-6 pb-16">
                {/* hero (always landing) */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="rounded-full">
                                English UI • Minimal • Professional
                            </Badge>
                            <Badge variant="secondary" className="rounded-full">
                                Django + Next.js
                            </Badge>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                            Manage patients & travelers <span className="text-primary">with clarity</span>.
                        </h1>

                        <p className="text-base md:text-lg text-muted-foreground max-w-xl">
                            A clean platform to manage cases, documents, and invoices for international patients—built
                            for speed,
                            privacy, and a great user experience.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {token ? (
                                <>
                                    <Link href="/dashboard">
                                        <Button className="rounded-2xl h-11 px-6">Open dashboard</Button>
                                    </Link>
                                    <Link href="/cases">
                                        <Button variant="outline" className="rounded-2xl h-11 px-6">
                                            View cases
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/register">
                                        <Button className="rounded-2xl h-11 px-6">Get started</Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button variant="outline" className="rounded-2xl h-11 px-6">
                                            Sign in
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* right card always looks like product, but becomes real when logged-in */}
                    <Card className="rounded-3xl shadow-xl border bg-background/60 backdrop-blur">
                        <CardContent className="p-6 md:p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-muted-foreground">
                                        {token ? "Your overview (live)" : "Product preview"}
                                    </div>
                                    <div className="text-xl font-semibold mt-1">
                                        {token ? "Your cases" : "Operator Dashboard"}
                                    </div>
                                </div>
                                <Badge className="rounded-full" variant="secondary">
                                    Fast • Clean
                                </Badge>
                            </div>

                            <div className="mt-6 space-y-4">
                                {!token ? (
                                    // demo cards for guest
                                    <>
                                        <div
                                            className="flex items-center justify-between rounded-2xl border bg-background p-4">
                                            <div>
                                                <div className="font-medium">Case: Knee Surgery</div>
                                                <div className="text-xs text-muted-foreground mt-1">Updated moments
                                                    ago
                                                </div>
                                            </div>
                                            <Badge className="rounded-full" variant="secondary">
                                                documents pending
                                            </Badge>
                                        </div>

                                        <div
                                            className="flex items-center justify-between rounded-2xl border bg-background p-4">
                                            <div>
                                                <div className="font-medium">Case: Oncology Review</div>
                                                <div className="text-xs text-muted-foreground mt-1">Updated moments
                                                    ago
                                                </div>
                                            </div>
                                            <Badge className="rounded-full" variant="secondary">
                                                invoice issued
                                            </Badge>
                                        </div>

                                        <div
                                            className="flex items-center justify-between rounded-2xl border bg-background p-4">
                                            <div>
                                                <div className="font-medium">Case: Dental Care</div>
                                                <div className="text-xs text-muted-foreground mt-1">Updated moments
                                                    ago
                                                </div>
                                            </div>
                                            <Badge className="rounded-full" variant="secondary">
                                                paid
                                            </Badge>
                                        </div>
                                    </>
                                ) : loading ? (
                                    <p className="text-sm text-muted-foreground">Loading…</p>
                                ) : (
                                    <>
                                        {/* داخل بخش token-logged-in */}
                                        {/* داخل بخش token-logged-in */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="rounded-2xl border bg-background p-4">
                                                <div className="text-xs text-muted-foreground">Cases</div>
                                                <div
                                                    className="text-2xl font-semibold mt-1">{overview?.total_cases ?? 0}</div>
                                            </div>
                                            <div className="rounded-2xl border bg-background p-4">
                                                <div className="text-xs text-muted-foreground">Documents</div>
                                                <div
                                                    className="text-2xl font-semibold mt-1">{overview?.total_documents ?? 0}</div>
                                            </div>
                                            <div className="rounded-2xl border bg-background p-4">
                                                <div className="text-xs text-muted-foreground">Unpaid</div>
                                                <div
                                                    className="text-2xl font-semibold mt-1">{overview?.unpaid_invoices_count ?? 0}</div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Total: {overview?.unpaid_invoices_total ?? "0"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className="rounded-2xl border bg-background p-4">
                                                <div className="text-sm font-semibold mb-2">Recent cases</div>
                                                <div className="space-y-2">
                                                    {(overview?.recent_cases ?? []).slice(0, 3).map((c) => (
                                                        <Link key={c.id} href={`/cases/${c.id}`}
                                                              className="block rounded-xl border p-3 hover:shadow-sm transition">
                                                            <div className="text-sm font-medium">{c.title}</div>
                                                            <div
                                                                className="text-xs text-muted-foreground mt-1">{c.status}</div>
                                                        </Link>
                                                    ))}
                                                    {(overview?.recent_cases?.length ?? 0) === 0 && (
                                                        <div className="text-sm text-muted-foreground">No cases
                                                            yet.</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="rounded-2xl border bg-background p-4">
                                                <div className="text-sm font-semibold mb-2">Recent invoices</div>
                                                <div className="space-y-2">
                                                    {(overview?.recent_invoices ?? []).slice(0, 3).map((i) => (
                                                        <Link key={i.id} href={`/cases/${i.case_id}`}
                                                              className="block rounded-xl border p-3 hover:shadow-sm transition">
                                                            <div className="text-sm font-medium">
                                                                {i.currency} {i.total_amount}
                                                            </div>
                                                            <div
                                                                className="text-xs text-muted-foreground mt-1">{i.status}</div>
                                                        </Link>
                                                    ))}
                                                    {(overview?.recent_invoices?.length ?? 0) === 0 && (
                                                        <div className="text-sm text-muted-foreground">No invoices
                                                            yet.</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="rounded-2xl border bg-background p-4">
                                                <div className="text-sm font-semibold mb-2">Recent documents</div>
                                                <div className="space-y-2">
                                                    {(overview?.recent_documents ?? []).slice(0, 3).map((d) => (
                                                        <Link key={d.id} href={`/cases/${d.case_id}`}
                                                              className="block rounded-xl border p-3 hover:shadow-sm transition">
                                                            <div className="text-sm font-medium">{d.title}</div>
                                                            <div
                                                                className="text-xs text-muted-foreground mt-1">{d.doc_type}</div>
                                                        </Link>
                                                    ))}
                                                    {(overview?.recent_documents?.length ?? 0) === 0 && (
                                                        <div className="text-sm text-muted-foreground">No documents
                                                            yet.</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>



                                        <div className="mt-4">
                                            <div className="text-sm font-semibold mb-2">Recent</div>
                                            <div className="space-y-3">
                                                {(overview?.recent_cases ?? []).slice(0, 3).map((c) => (
                                                    <Link
                                                        key={c.id}
                                                        href={`/cases/${c.id}`}
                                                        className="block rounded-2xl border bg-background p-4 hover:shadow-sm transition"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <div className="font-medium">{c.title}</div>
                                                                <div className="text-xs text-muted-foreground mt-1">
                                                                    {new Date(c.created_at).toLocaleString()}
                                                                </div>
                                                            </div>
                                                            <Badge className="rounded-full" variant="secondary">
                                                                {c.status}
                                                            </Badge>
                                                        </div>
                                                    </Link>
                                                ))}
                                                {(overview?.recent_cases?.length ?? 0) === 0 && (
                                                    <p className="text-sm text-muted-foreground">No cases yet.</p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* features (always) */}
                <section className="mt-14">
                    <div className="flex items-end justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="text-2xl font-semibold">Everything you need</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Clean workflow: case → documents → invoice → payment.
                            </p>
                        </div>
                        <Badge variant="secondary" className="rounded-full">
                            No paid plugins • No cracked assets
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                        {features.map((f) => (
                            <Card key={f.title} className="rounded-2xl shadow-sm hover:shadow-md transition">
                                <CardContent className="p-6">
                                    <div className="font-semibold">{f.title}</div>
                                    <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* footer */}
                <footer className="mt-14 pb-10">
                    <div
                        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t pt-8">
                        <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Medical Travel
                            Platform
                        </div>
                        <div className="flex gap-4 text-sm">
                            <Link className="text-muted-foreground hover:text-foreground" href="/login">
                                Sign in
                            </Link>
                            <Link className="text-muted-foreground hover:text-foreground" href="/register">
                                Create account
                            </Link>
                            <Link className="text-muted-foreground hover:text-foreground" href="/dashboard">
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}