import { betterAuth } from "better-auth";
import Database from "bun:sqlite";

const db = new Database("auth.db")

export const auth = betterAuth({
    database: db,

    emailAndPassword: {
        enabled: true,
    },

    advanced: {
        cookiePrefix: "ez_admin",
        defaultCookieAttributes: {
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
        },
    },

    trustedOrigins: [
        process.env.FRONTEND_URL!,
    ],
});