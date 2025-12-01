import type { Request, Response, NextFunction } from 'express';
import { validateTelegramInitData } from '../utils/telegram.js';

declare module 'express-serve-static-core' {
  interface Request {
    telegramUser?: {
      id: number;
      username?: string;
      first_name?: string;
      last_name?: string;
      photo_url?: string;
    };
  }
}

export const telegramAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const initData = req.header('x-telegram-init');
    if (!initData) {
      return res.status(401).json({ message: 'Missing Telegram init data' });
    }
    const parsed = validateTelegramInitData(initData);
    req.telegramUser = parsed.user as Request['telegramUser'];
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Telegram signature' });
  }
};

