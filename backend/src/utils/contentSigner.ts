import crypto from 'crypto';
import { env } from '../config/env.js';

const SIGNATURE_TTL_SECONDS = 30;

export const signContentUrl = (assetKey: string, userId: string) => {
  const expiry = Math.floor(Date.now() / 1000) + SIGNATURE_TTL_SECONDS;
  const payload = `${assetKey}:${userId}:${expiry}`;
  const signature = crypto.createHmac('sha256', env.CONTENT_SIGNING_SECRET)
    .update(payload)
    .digest('hex');

  const url = new URL(env.CONTENT_BASE_URL);
  url.pathname = assetKey;
  url.searchParams.set('expiry', expiry.toString());
  url.searchParams.set('user', userId);
  url.searchParams.set('sig', signature);

  return {
    url: url.toString(),
    expiresAt: new Date(expiry * 1000)
  };
};

