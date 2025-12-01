FROM node:20-slim AS base
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY backend/package.json backend/package-lock.json* ./
RUN npm install
COPY backend/ .
RUN npx prisma generate
RUN npm run build

FROM node:20-slim AS runtime
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
ENV NODE_ENV=production
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node dist/index.js"]
