export type ProviderPayload = {
  txHash: string;
  amount: number;
  amountUsd: number;
  address: string;
  memo?: string;
  chain: string;
  asset: string;
};

export interface PaymentProvider {
  name: string;
  verify(payload: unknown): ProviderPayload;
}

export class HeliusWebhookProvider implements PaymentProvider {
  name = 'helius';
  verify(payload: any): ProviderPayload {
    // TODO: parse actual Helius payload
    return {
      txHash: payload.signature,
      amount: payload.amount,
      amountUsd: payload.amountUsd,
      address: payload.address,
      memo: payload.memo,
      chain: 'solana',
      asset: payload.asset ?? 'USDC'
    };
  }
}

export class TonWebhookProvider implements PaymentProvider {
  name = 'ton';
  verify(payload: any): ProviderPayload {
    return {
      txHash: payload.hash,
      amount: payload.amount,
      amountUsd: payload.amountUsd,
      address: payload.to,
      memo: payload.comment,
      chain: 'ton',
      asset: 'TON'
    };
  }
}

export const providers: Record<string, PaymentProvider> = {
  helius: new HeliusWebhookProvider(),
  ton: new TonWebhookProvider()
};

