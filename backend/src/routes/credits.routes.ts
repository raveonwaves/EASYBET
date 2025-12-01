import { Router } from 'express';
import { z } from 'zod';
import { addCredits, subtractCredits } from '../services/credits.service.js';

const router = Router();

const schema = z.object({
  userId: z.string(),
  amount: z.number().int(),
  reason: z.string().optional()
});

router.post('/add', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }
  const balance = await addCredits(parsed.data.userId, parsed.data.amount, 'admin_bonus', {
    reason: parsed.data.reason
  });
  res.json({ creditsBalance: balance });
});

router.post('/subtract', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }
  try {
    const balance = await subtractCredits(parsed.data.userId, parsed.data.amount, 'admin_bonus', {
      reason: parsed.data.reason
    });
    res.json({ creditsBalance: balance });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

