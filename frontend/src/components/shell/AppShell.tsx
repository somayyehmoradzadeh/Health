"use client";

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {logout} from "@/lib/auth";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";

const nav = [
    {href: "/dashboard", label: "Dashboard"},
    {href: "/cases", label: "Cases"},
    {href: "/invoices", label: "Invoices"},
];

export function AppShell({children}: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
                <aside className="md:sticky md:top-6 h-fit">
                    <Card className="rounded-2xl shadow-sm">
                        <div className="p-5 border-b">
                            <div className="font-semibold text-lg">Medical Travel</div>
                            <div className="text-xs text-muted-foreground mt-1">Case Management</div>
                        </div>

                        <nav className="p-3 space-y-1">
                            {nav.map((item) => {
                                const active = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={[
                                            "block rounded-xl px-3 py-2 text-sm transition",
                                            active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                                        ].join(" ")}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-3 border-t">
                            <Button
                                variant="outline"
                                className="w-full rounded-xl"
                                onClick={() => {
                                    logout();
                                    router.push("/login");
                                }}
                            >
                                Sign out
                            </Button>
                        </div>
                    </Card>
                </aside>

                <main className="space-y-6">{children}</main>
            </div>
        </div>
    );
}