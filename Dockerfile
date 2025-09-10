# Stage 1: Install dependencies
FROM node:lts-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# Copy prisma schema to ensure prisma generate runs correctly
COPY prisma ./prisma
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Stage 2: Build the application
FROM node:lts-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm prisma generate && pnpm run build

# Stage 3: Production server
FROM node:lts-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# ENV PORT=8080 # PORT is automatically set by Cloud Run

# Copy standalone build output
COPY --from=builder /app/.next/standalone ./
# Copy the generated prisma client
COPY --from=builder /app/lib/generated/prisma ./lib/generated/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# EXPOSE 8080 # Not needed on Cloud Run

# Run Next.js server
CMD ["node", "server.js"]