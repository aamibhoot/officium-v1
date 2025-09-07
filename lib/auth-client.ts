import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields, adminClient } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";
// import { ac, roles } from "@/lib/permissions";

const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    plugins: [inferAdditionalFields<typeof auth>()],
})

export const {
    signUp, signIn, signOut, useSession
} = authClient