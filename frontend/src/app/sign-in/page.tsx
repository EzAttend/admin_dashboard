"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error: authError } = await signIn.email({
            email,
            password,
        });

        setLoading(false);

        if (authError) {
            setError(authError.message ?? "Sign in failed");
            return;
        }

        router.push(callbackUrl);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-surface-raised rounded-xl shadow-lg p-8 space-y-6 animate-fade-in"
            >
                <div className="text-center space-y-1">
                    <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-sm mx-auto">
                        SA
                    </div>
                    <h1 className="text-xl font-semibold">Sign In</h1>
                    <p className="text-sm text-gray-500">Smart Attendance Admin</p>
                </div>

                {error && (
                    <p className="text-sm text-danger-500 bg-danger-50 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                    {loading ? "Signing in…" : "Sign In"}
                </button>

                <p className="text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up" className="text-primary-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}
