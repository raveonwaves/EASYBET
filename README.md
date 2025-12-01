## Telegram Mini App Crediti & Contenuti

Monorepo per la mini app Telegram con:
- Backend Node/Express + Prisma/PostgreSQL
- Frontend React/Vite ottimizzato per Telegram WebApp
- Sistema crediti, referral, pagamenti multi-chain e contenuti protetti

### Struttura
- `backend`: API REST, webhook, gestione crediti e contenuti
- `frontend`: Mini app + admin panel
- `docs`: guida deploy, reference
- `scripts/install.sh`: installazione rapida

### Setup rapido
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
./scripts/install.sh
```

### Avvio sviluppo
```bash
# database
docker compose up -d postgres

# backend
cd backend
npx prisma migrate dev
npm run dev

# frontend
cd frontend
npm run dev
```

### Funzioni principali
- Inizializzazione utente via Telegram init data
- Ricariche crediti con indirizzi dedicati per chain
- Webhook Helius/Ton per accrediti automatici
- Referral bonus configurabili
- Sblocco contenuti + URL firmati short-lived
- Admin bonus manuali e caricamento contenuti
- OpenAPI via `/docs`

### Deploy
Vedi `docs/deployment.md` per istruzioni VPS + R2 + hosting statico.
