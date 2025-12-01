-- Initial schema for Easy Bet

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "User" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "telegramId" bigint UNIQUE NOT NULL,
  "username" text,
  "firstName" text,
  "lastName" text,
  "referralCode" text UNIQUE NOT NULL,
  "invitedById" uuid REFERENCES "User"("id"),
  "creditsBalance" integer NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "Content" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" text NOT NULL,
  "description" text NOT NULL,
  "priceCredits" integer NOT NULL,
  "assetKey" text NOT NULL,
  "storagePath" text NOT NULL,
  "unlocksAt" timestamptz,
  "publicAt" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "UnlockedContent" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid REFERENCES "User"("id") ON DELETE CASCADE,
  "contentId" uuid REFERENCES "Content"("id") ON DELETE CASCADE,
  "unlockedAt" timestamptz NOT NULL DEFAULT now(),
  "expiresAt" timestamptz
);

CREATE TABLE "CreditsTransaction" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid REFERENCES "User"("id") ON DELETE CASCADE,
  "amount" integer NOT NULL,
  "type" text NOT NULL,
  "reference" text,
  "metadata" jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "CryptoPayment" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid REFERENCES "User"("id") ON DELETE CASCADE,
  "chain" text NOT NULL,
  "asset" text NOT NULL,
  "address" text NOT NULL,
  "memo" text,
  "amount" double precision,
  "amountUsd" double precision,
  "credits" integer,
  "txHash" text UNIQUE,
  "status" text NOT NULL DEFAULT 'pending',
  "rawPayload" jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "Referral" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "inviterId" uuid REFERENCES "User"("id"),
  "inviteeId" uuid REFERENCES "User"("id"),
  "bonusApplied" boolean NOT NULL DEFAULT false,
  "bonusInviter" integer,
  "bonusInvitee" integer,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX "Referral_inviter_invitee_idx" ON "Referral"("inviterId","inviteeId");

CREATE TABLE "AdminLog" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "adminUser" text NOT NULL,
  "action" text NOT NULL,
  "metadata" jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "User_telegramId_idx" ON "User"("telegramId");
CREATE INDEX IF NOT EXISTS "User_referralCode_idx" ON "User"("referralCode");
CREATE INDEX IF NOT EXISTS "CreditsTransaction_userId_idx" ON "CreditsTransaction"("userId");
CREATE INDEX IF NOT EXISTS "UnlockedContent_user_content_idx" ON "UnlockedContent"("userId", "contentId");
CREATE INDEX IF NOT EXISTS "CryptoPayment_status_idx" ON "CryptoPayment"("status");
CREATE INDEX IF NOT EXISTS "Referral_inviter_idx" ON "Referral"("inviterId");
CREATE INDEX IF NOT EXISTS "Referral_invitee_idx" ON "Referral"("inviteeId");

