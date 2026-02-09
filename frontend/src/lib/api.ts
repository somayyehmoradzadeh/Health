export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

export type Tokens = { access: string; refresh: string };

export async function login(username: string, password: string): Promise<Tokens> {
    const res = await fetch(`${API_BASE}/api/v1/auth/token/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password}),
    });

    if (!res.ok) {
        throw new Error("Invalid username or password");
    }
    return res.json();
}


export async function register(username: string, email: string, password: string) {
    const res = await fetch(`${API_BASE}/api/v1/auth/register/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, email, password}),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Registration failed");
    }
    return res.json();
}