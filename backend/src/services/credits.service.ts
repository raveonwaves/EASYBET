import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

type CreditTransactionType =
  | 'payment'
  | 'content_unlock'
  | 'referral_bonus'
  | 'admin_bonus';

export const addCredits = async (
  userId: string,
  amount: number,
  type: CreditTransactionType,
  metadata?: Prisma.InputJsonValue
) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      creditsBalance: { increment: amount },
      creditsLogs: {
        create: {
          amount,
          type,
          metadata
        }
      }
    }
  });
  return user.creditsBalance;
};

export const subtractCredits = async (
  userId: string,
  amount: number,
  type: CreditTransactionType,
  metadata?: Prisma.InputJsonValue
) => {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.creditsBalance < amount) {
      throw new Error('Insufficient credits');
    }
    const updated = await tx.user.update({
      where: { id: userId },
      data: {
        creditsBalance: { decrement: amount },
        creditsLogs: {
          create: {
            amount: -amount,
            type,
            metadata
          }
        }
      }
    });
    return updated.creditsBalance;
  });
};

