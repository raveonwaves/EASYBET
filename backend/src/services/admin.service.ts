import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

export const recordAdminAction = async (
  adminUser: string,
  action: string,
  metadata?: Prisma.InputJsonValue
) => {
  return prisma.adminLog.create({
    data: { adminUser, action, metadata }
  });
};

