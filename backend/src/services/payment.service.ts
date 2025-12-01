import { randomUUID } from 'crypto';
import { prisma } from '../lib/prisma.js';

type Chain =
  | 'solana'
  | 'ton'
  | 'ethereum'
  | 'polygon'
  | 'avalanche'
  | 'bsc'
  | 'bitcoin_lightning';

interface PaymentRequestInput {
  userId: string;
  chain: Chain;
  asset: string;
  amountUsd: number;
  credits: number;
}

export const createPaymentRequest = async (input: PaymentRequestInput) => {
  const address = `${input.chain}-${randomUUID()}`;
  const memo = randomUUID().slice(0, 8);

  const payment = await prisma.cryptoPayment.create({
    data: {
      userId: input.userId,
      chain: input.chain,
      asset: input.asset,
      address,
      memo,
      amountUsd: input.amountUsd,
      credits: input.credits
    }
  });
  return payment;
};

export const confirmPayment = async (params: {
  paymentId: string;
  txHash: string;
  amount: number;
  amountUsd: number;
}) => {
  const payment = await prisma.cryptoPayment.update({
    where: { id: params.paymentId },
    data: {
      amount: params.amount,
      amountUsd: params.amountUsd,
      status: 'confirmed',
      txHash: params.txHash
    }
  });
  return payment;
};

