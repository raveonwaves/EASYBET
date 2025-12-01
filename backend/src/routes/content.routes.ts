import { Router } from 'express';
import { z } from 'zod';
import { listContents, unlockContent, getContentAccess } from '../services/content.service.js';

const router = Router();

router.get('/list', async (req, res) => {
  const userId = req.query.userId as string;
  const contents = await listContents(userId);
  res.json(contents);
});

router.post('/unlock', async (req, res) => {
  const schema = z.object({
    userId: z.string(),
    contentId: z.string()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }
  try {
    const result = await unlockContent(parsed.data.userId, parsed.data.contentId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.post('/access', async (req, res) => {
  const schema = z.object({
    userId: z.string(),
    contentId: z.string()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }
  try {
    const link = await getContentAccess(parsed.data.userId, parsed.data.contentId);
    res.json(link);
  } catch (error) {
    res.status(403).json({ message: (error as Error).message });
  }
});

export default router;

