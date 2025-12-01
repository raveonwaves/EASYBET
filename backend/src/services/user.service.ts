import { prisma } from '../lib/prisma.js';
import { generateReferralCode } from '../utils/referral.js';

export const upsertUserFromTelegram = async (telegramUser: {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}, invitedByCode?: string) => {
  const referralCode = generateReferralCode(telegramUser.username);

  const user = await prisma.user.upsert({
    where: { telegramId: BigInt(telegramUser.id) },
    create: {
      telegramId: BigInt(telegramUser.id),
      username: telegramUser.username,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      referralCode,
      invitedBy: invitedByCode ? {
        connect: { referralCode: invitedByCode }
      } : undefined
    },
    update: {
      username: telegramUser.username,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name
    }
  });

  return user;
};

export const getUserBalance = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditsBalance: true }
  });
  return user?.creditsBalance ?? 0;
};

