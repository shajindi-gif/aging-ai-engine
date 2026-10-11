# ═══════════════════════════════════════════════
# 衍策银龄 AI — 生产镜像（Next.js standalone）
# 构建: docker build --build-arg NEXT_PUBLIC_SITE_URL=https://yanglaoai999.com -t yanglaoai-app .
# 运行: 见 docker-compose.prod.yml（env 从 .env.production 注入）
# ═══════════════════════════════════════════════

FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 客户端可见变量需在构建期注入
ARG NEXT_PUBLIC_SITE_URL=https://yanglaoai999.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_OUTPUT=standalone
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate && npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
# Prisma 引擎显式拷贝（standalone 追踪不全的兜底）
COPY --from=builder --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=node:node /app/node_modules/@prisma ./node_modules/@prisma

# Prisma 引擎需要系统 libssl（node:slim 不含）
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl

USER node
EXPOSE 3000
CMD ["node", "server.js"]
