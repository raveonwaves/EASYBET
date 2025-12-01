import dayjs from 'dayjs';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { signContentUrl } from '../utils/contentSigner.js';
import { subtractCredits } from './credits.service.js';

export const listContents = async (userId: string) => {
  const [contents, unlocked] = await Promise.all([
    prisma.content.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.unlockedContent.findMany({
      where: { userId },
      select: { contentId: true }
    })
  ]);
  const unlockedIds = new Set(unlocked.map((c: { contentId: string }) => c.contentId));
  return contents.map((content) => ({
    ...content,
    unlocked: unlockedIds.has(content.id) || Boolean(content.publicAt && dayjs(content.publicAt).isBefore(dayjs())),
    unlocksAt: content.unlocksAt,
    publicAt: content.publicAt
  }));
};

export const unlockContent = async (userId: string, contentId: string) => {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const content = await tx.content.findUniqueOrThrow({ where: { id: contentId } });

    if (content.publicAt && dayjs(content.publicAt).isBefore(new Date())) {
      // already public
      return {
        alreadyPublic: true,
        unlockedUrl: signContentUrl(content.assetKey, userId)
      };
    }

    const existing = await tx.unlockedContent.findFirst({
      where: { userId, contentId }
    });
    if (existing) {
      return {
        alreadyUnlocked: true,
        unlockedUrl: signContentUrl(content.assetKey, userId)
      };
    }

    await subtractCredits(userId, content.priceCredits, 'content_unlock', { contentId });

    await tx.unlockedContent.create({
      data: { userId, contentId }
    });

    return {
      creditsSpent: content.priceCredits,
      unlockedUrl: signContentUrl(content.assetKey, userId)
    };
  });
};

export const adminCreateContent = async (input: {
  title: string;
  description: string;
  priceCredits: number;
  assetKey: string;
  storagePath: string;
  unlocksAt?: Date;
  publicAt?: Date;
}) => {
  return prisma.content.create({ data: input });
};

export const getContentAccess = async (userId: string, contentId: string) => {
  const content = await prisma.content.findUniqueOrThrow({ where: { id: contentId } });
  const isPublic = content.publicAt && dayjs(content.publicAt).isBefore(dayjs());
  const hasUnlock = await prisma.unlockedContent.findFirst({
    where: { userId, contentId }
  });
  if (!isPublic && !hasUnlock) {
    throw new Error('Content locked');
  }
  return signContentUrl(content.assetKey, userId);
};

