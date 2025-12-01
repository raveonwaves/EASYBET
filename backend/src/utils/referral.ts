import { randomInt } from 'crypto';

export const generateReferralCode = (username?: string | null): string => {
  const prefix = username?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'USER';
  return `${prefix}-${randomInt(1000, 9999)}`;
};

