import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@/lib/generated/prisma";
import { hashPassword, verifyPassword } from "@/lib/argon2";
import {normalizeName, VALID_DOMAINS} from "@/lib/utils";
import { createAuthMiddleware } from "better-auth/api";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    maxPasswordLength: 128,
    minPasswordLength: 8,
    autoSignIn: false,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const email = String(ctx.body.email);
        const domain = email.split("@")[1];

        if (!VALID_DOMAINS().includes(domain)) {
          console.error("API_x0A3_ERROR Invalid domain:", domain);
          throw new APIError("BAD_REQUEST", {
            message: "Invalid domain. Please use your work email.",
          });
        }

        const name = normalizeName(ctx.body.name);

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              name,
            },
          },
        };
      }
    }),
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
  advanced: {
    generateId: false
  },
  // This should be a long, random string in a real application
  secret: process.env.BETTER_AUTH_SECRET!,
});


export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN_AUTH_x0A0_ERROR";