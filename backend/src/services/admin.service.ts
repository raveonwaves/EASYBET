import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

export const recordAdminAction = async (adminUser: string, action: string, metadata?: Record<string, unknown>) => {
  return prisma.adminLog.create({
    data: { adminUser, action, metadata: metadata as Prisma.InputJsonValue }
  });
};

