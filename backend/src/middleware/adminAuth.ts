import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.header('x-admin-token') !== env.ADMIN_API_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

