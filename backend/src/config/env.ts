import 'dotenv/config';

const number = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const required = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing ${name} env`);
  }
  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: number(process.env.PORT, 4000),
  DATABASE_URL: required(process.env.DATABASE_URL, 'DATABASE_URL'),
  TELEGRAM_BOT_WEBAPP_SECRET: required(process.env.TELEGRAM_BOT_WEBAPP_SECRET, 'TELEGRAM_BOT_WEBAPP_SECRET'),
  JWT_SECRET: required(process.env.JWT_SECRET, 'JWT_SECRET'),
  ADMIN_API_TOKEN: required(process.env.ADMIN_API_TOKEN, 'ADMIN_API_TOKEN'),
  REFERRAL_BONUS_INVITER_PCT: Number(process.env.REFERRAL_BONUS_INVITER_PCT ?? '0.2'),
  REFERRAL_BONUS_INVITED_STATIC: Number(process.env.REFERRAL_BONUS_INVITED_STATIC ?? '50'),
  CONTENT_BASE_URL: required(process.env.CONTENT_BASE_URL, 'CONTENT_BASE_URL'),
  CONTENT_SIGNING_SECRET: required(process.env.CONTENT_SIGNING_SECRET, 'CONTENT_SIGNING_SECRET'),
  HELIUS_API_KEY: process.env.HELIUS_API_KEY ?? '',
  TON_WEBHOOK_SECRET: process.env.TON_WEBHOOK_SECRET ?? '',
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL ?? '',
  EVM_RPC_URL: process.env.EVM_RPC_URL ?? '',
  POLYGON_RPC_URL: process.env.POLYGON_RPC_URL ?? '',
  AVALANCHE_RPC_URL: process.env.AVALANCHE_RPC_URL ?? '',
  BNB_RPC_URL: process.env.BNB_RPC_URL ?? '',
  BITCOIN_LIGHTNING_URL: process.env.BITCOIN_LIGHTNING_URL ?? '',
  BITCOIN_LIGHTNING_MACAROON: process.env.BITCOIN_LIGHTNING_MACAROON ?? ''
};

