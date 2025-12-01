import { Router } from 'express';
import { z } from 'zod';
import { addCredits } from '../services/credits.service.js';
import { adminCreateContent } from '../services/content.service.js';
import { recordAdminAction } from '../services/admin.service.js';

const router = Router();

const adminInfo = (req: any) => req.header('x-admin-user') ?? 'unknown-admin';

router.post('/bonus', async (req, res) => {
  const schema = z.object({
    userId: z.string(),
    amount: z.number()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }
  await addCredits(parsed.data.userId, parsed.data.amount, 'admin_bonus', { admin: adminInfo(req) });
  await recordAdminAction(adminInfo(req), 'bonus', parsed.data);
  res.json({ ok: true });
});

router.post('/content/add', async (req, res) => {
  const schema = z.object({
    title: z.string(),
    description: z.string(),
    priceCredits: z.number(),
    assetKey: z.string(),
    storagePath: z.string(),
    unlocksAt: z.string().optional(),
    publicAt: z.string().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }
  const content = await adminCreateContent({
    ...parsed.data,
    unlocksAt: parsed.data.unlocksAt ? new Date(parsed.data.unlocksAt) : undefined,
    publicAt: parsed.data.publicAt ? new Date(parsed.data.publicAt) : undefined
  });
  await recordAdminAction(adminInfo(req), 'content_add', { contentId: content.id });
  res.json(content);
});

export default router;

