# Base image for all stages
FROM node:lts-alpine AS base
WORKDIR /app
RUN corepack enable pnpm

# --- Dependencies ---
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# --- Builder ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm prisma generate
RUN pnpm run build

# --- Runner ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy the standalone Next.js server
COPY --from=builder /app/.next/standalone ./
# Copy static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
# Copy custom Prisma output
COPY --from=builder /app/lib/generated/prisma ./lib/generated/prisma

CMD ["node", "server.js"]
