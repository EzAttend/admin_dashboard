FROM oven/bun:1.1-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lockb* bunfig.toml* ./
RUN bun install --production

FROM base AS builder
COPY package.json bun.lockb* bunfig.toml* ./
RUN bun install
COPY . .
RUN bun run build

FROM base AS runner

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

#data directory for SQLite (to be mounted as volume)
RUN mkdir -p /app/data && chown -R appuser:nodejs /app/data

WORKDIR /app

COPY --from=deps --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/package.json ./package.json
COPY --from=builder --chown=appuser:nodejs /app/scripts ./scripts

USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["sh", "-c", "bun scripts/migrate-auth.ts && bun run start"]
