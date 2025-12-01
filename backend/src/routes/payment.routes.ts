import { Router } from 'express';
import { z } from 'zod';
import { createPaymentRequest, confirmPayment } from '../services/payment.service.js';
import { addCredits } from '../services/credits.service.js';
import { prisma } from '../lib/prisma.js';
import { providers } from '../providers/payments/index.js';
import { applyReferralBonus } from '../services/referral.service.js';

const router = Router();

const createPaymentSchema = z.object({
  userId: z.string(),
  chain: z.enum(['solana', 'ton', 'ethereum', 'polygon', 'avalanche', 'bsc', 'bitcoin_lightning']),
  asset: z.string(),
  amountUsd: z.number().positive(),
  credits: z.number().positive()
});

router.post('/create', async (req, res) => {
  const parsed = createPaymentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }
  const payment = await createPaymentRequest(parsed.data);
  res.json(payment);
});

router.post('/webhook/:provider', async (req, res) => {
  const provider = providers[req.params.provider];
  if (!provider) {
    return res.status(400).json({ message: 'Unknown provider' });
  }
  try {
    const verified = provider.verify(req.body);
    const payment = await prisma.cryptoPayment.findFirst({
      where: {
        address: verified.address,
        memo: verified.memo ?? undefined,
        status: 'pending'
      }
    });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    await confirmPayment({
      paymentId: payment.id,
      txHash: verified.txHash,
      amount: verified.amount,
      amountUsd: verified.amountUsd
    });
    await addCredits(payment.userId, payment.credits ?? 0, 'payment', {
      txHash: verified.txHash,
      chain: payment.chain
    });
    await applyReferralBonus(payment.userId);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid payload' });
  }
});

export default router;

