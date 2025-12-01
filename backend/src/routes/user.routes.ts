import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { upsertUserFromTelegram, getUserBalance } from '../services/user.service.js';

const router = Router();

router.post('/init', async (req, res) => {
  if (!req.telegramUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const invitedBy = req.body.referralCode as string | undefined;
  const user = await upsertUserFromTelegram(req.telegramUser, invitedBy);
  res.json({ id: user.id, referralCode: user.referralCode, creditsBalance: user.creditsBalance });
});

router.get('/balance', async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }
  const balance = await getUserBalance(userId);
  res.json({ creditsBalance: balance });
});

router.get('/transactions', async (req, res) => {
  const userId = req.query.userId as string;
  const logs = await prisma.creditsTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  res.json(logs);
});

export default router;

