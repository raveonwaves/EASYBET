import crypto from 'crypto';
import qs from 'qs';
import { env } from '../config/env.js';

export const validateTelegramInitData = (initData: string): Record<string, any> => {
  const parsed = qs.parse(initData);
  const hash = parsed.hash as string;
  if (!hash) {
    throw new Error('Missing hash');
  }

  const dataCheckArr = Object.keys(parsed)
    .filter((key) => key !== 'hash')
    .sort()
    .map((key) => `${key}=${parsed[key]}`)
    .join('\n');

  const secret = crypto.createHmac('sha256', 'WebAppData')
    .update(env.TELEGRAM_BOT_WEBAPP_SECRET)
    .digest();

  const computed = crypto.createHmac('sha256', secret)
    .update(dataCheckArr)
    .digest('hex');

  if (computed !== hash) {
    throw new Error('Invalid Telegram signature');
  }

  return parsed;
};

