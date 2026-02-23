import { betterAuth } from "better-auth";
import Database from "bun:sqlite";

const db = new Database("auth.db")

export const auth = betterAuth({
    database: db,
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.FRONTEND_URL || "http://localhost:3000",

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
        process.env.FRONTEND_URL || "http://localhost:3000",
    ],
});