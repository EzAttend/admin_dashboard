import { betterAuth } from "better-auth";
import { Database } from "bun:sqlite";

// Use data directory for persistent storage (mounted volume in production)
const dbPath = process.env.AUTH_DB_PATH || "/app/data/auth.db";
const db = new Database(dbPath);

if (!process.env.FRONTEND_URL) throw new Error("FRONTEND_URL is required");
if (!process.env.BETTER_AUTH_SECRET) throw new Error("BETTER_AUTH_SECRET is required");

export const auth = betterAuth({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    database: db as any,
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,

    emailAndPassword: {
        enabled: true,
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5,
        },
    },

    advanced: {
        cookiePrefix: "ez_admin",
        defaultCookieAttributes: {
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            path: "/",
        },
        crossSubDomainCookies: {
            enabled: false,
        },
    },

    trustedOrigins: [
        process.env.FRONTEND_URL,
    ],
});