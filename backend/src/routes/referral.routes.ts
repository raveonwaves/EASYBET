import { Router } from 'express';
import { z } from 'zod';
import { ensureReferral } from '../services/referral.service.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.post('/apply', async (req, res) => {
  const schema = z.object({
    inviterCode: z.string(),
    inviteeId: z.string()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }
  const inviter = await prisma.user.findUnique({
    where: { referralCode: parsed.data.inviterCode }
  });
  if (!inviter) {
    return res.status(404).json({ message: 'Inviter not found' });
  }
  const referral = await ensureReferral(inviter.id, parsed.data.inviteeId);
  res.json(referral);
});

router.get('/code', async (req, res) => {
  const userId = req.query.userId as string;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true }
  });
  res.json({ referralCode: user?.referralCode });
});

export default router;

