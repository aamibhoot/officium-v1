# Base image for all stages
FROM node:lts-alpine AS base
WORKDIR /app
RUN corepack enable pnpm

# --- Dependencies ---
# Install all dependencies and create a base for the prisma client
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# --- Builder ---
# Build the application
FROM base AS builder
# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the application code
COPY . .
# Generate prisma client and build the app
RUN pnpm prisma generate
RUN pnpm run build

# --- Runner ---
# Final, small production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy the standalone output
COPY --from=builder /app/.next/standalone ./
# Copy public and static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
# Copy the generated Prisma client and engine from the builder stage
COPY --from=builder /app/lib/generated/prisma ./lib/generated/prisma
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client

CMD ["node", "server.js"]
