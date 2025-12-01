## Deployment Guide

### Infrastructure
- Hetzner CX or OVH VPS with Docker + Docker Compose
- Cloudflare R2 bucket for protected assets
- Cloudflare DNS for `api.domain.com` and `mini-app.domain.com`
- Postgres via managed service or dockerized instance

### Steps
1. Clone repository and copy `.env.example` into `.env`.
2. Provision Postgres. Update `DATABASE_URL`.
3. Run `docker compose up -d postgres`.
4. Inside backend container run `npx prisma migrate deploy`.
5. Build backend image: `docker build -t easybet-backend ./backend`.
6. Run backend: `docker run -d --env-file backend/.env -p 4000:4000 easybet-backend`.
7. Build frontend: `cd frontend && npm run build`.
8. Upload `frontend/dist` to Vercel/Netlify (static).
9. Configure Telegram WebApp URL to hosted frontend.
10. Set Cloudflare Worker or R2 Signed URLs to map to `CONTENT_BASE_URL`.

### Webhook Endpoints
- `POST https://api.domain.com/api/payment/webhook/helius` for Solana (set in Helius).
- `POST https://api.domain.com/api/payment/webhook/ton` for TON provider.
- Additional providers can be implemented in `src/providers/payments`.

### Monitoring
- Enable HTTPS via Caddy/NGINX reverse proxy.
- Configure health checks on `/health`.
- Capture logs via Docker logging driver or Promtail.

