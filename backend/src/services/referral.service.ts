import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { addCredits } from './credits.service.js';

export const ensureReferral = async (inviterId: string, inviteeId: string) => {
  return prisma.referral.upsert({
    where: {
      inviterId_inviteeId: {
        inviterId,
        inviteeId
      }
    },
    create: { inviterId, inviteeId },
    update: {}
  });
};

export const applyReferralBonus = async (inviteeId: string) => {
  const referral = await prisma.referral.findFirst({
    where: { inviteeId, bonusApplied: false },
    include: { inviter: true }
  });
  if (!referral) {
    return null;
  }

  return prisma.$transaction(async (tx) => {
    const invitee = await tx.user.findUniqueOrThrow({ where: { id: inviteeId } });
    const inviter = referral.inviter;
    if (!inviter) {
      return null;
    }

    const bonusInvitee = env.REFERRAL_BONUS_INVITED_STATIC;
    const bonusInviter = Math.floor((invitee.creditsBalance + bonusInvitee) * env.REFERRAL_BONUS_INVITER_PCT);

    await Promise.all([
      addCredits(inviter.id, bonusInviter, 'referral_bonus', { inviteeId }),
      addCredits(inviteeId, bonusInvitee, 'referral_bonus', { inviterId: inviter.id }),
      tx.referral.update({
        where: { id: referral.id },
        data: {
          bonusApplied: true,
          bonusInviter,
          bonusInvitee
        }
      })
    ]);
    return { bonusInvitee, bonusInviter };
  });
};

