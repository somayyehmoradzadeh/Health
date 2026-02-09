"use client";

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {register, login} from "@/lib/api";
import {saveTokens} from "@/lib/auth";

import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            await register(username, email, password);
            // auto-login after signup:
            const tokens = await login(username, password);
            saveTokens(tokens);
            router.push("/dashboard");
        } catch (e: any) {
            setErr("Registration failed. Please check inputs.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background to-muted">
            <Card className="w-full max-w-md rounded-2xl shadow-xl">
                <CardContent className="p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold">Create account</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Sign up as a patient user.
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Username</Label>
                            <Input className="rounded-2xl" value={username}
                                   onChange={(e) => setUsername(e.target.value)}/>
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input className="rounded-2xl" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>

                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input className="rounded-2xl" type="password" value={password}
                                   onChange={(e) => setPassword(e.target.value)}/>
                        </div>

                        {err && <p className="text-sm text-red-600">{err}</p>}

                        <Button className="w-full rounded-2xl" disabled={loading}>
                            {loading ? "Creating…" : "Create account"}
                        </Button>
                    </form>

                    <div className="mt-6 text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link className="underline" href="/login">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}