import { useState } from 'react';
import { api } from '../services/api';
import { useUserStore } from '../context/userStore';

const CHAINS = [
  { id: 'solana', label: 'Solana (USDC/SOL)' },
  { id: 'ton', label: 'TON' },
  { id: 'ethereum', label: 'Ethereum (USDT/ETH)' },
  { id: 'polygon', label: 'Polygon (USDC/MATIC)' },
  { id: 'avalanche', label: 'Avalanche (USDC/AVAX)' },
  { id: 'bsc', label: 'BNB Chain (BUSD/BNB)' },
  { id: 'bitcoin_lightning', label: 'Bitcoin Lightning' }
];

export const RechargeModal = () => {
  const [open, setOpen] = useState(false);
  const [amountUsd, setAmountUsd] = useState(10);
  const [chain, setChain] = useState('solana');
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const { userId } = useUserStore();

  const handleCreate = async () => {
    if (!userId) return;
    const credits = amountUsd * 100;
    const { data } = await api.post('/payment/create', {
      userId,
      chain,
      asset: 'USDC',
      amountUsd,
      credits
    });
    setPaymentInfo(data);
  };

  return (
    <div style={{ background: '#141826', padding: 16, borderRadius: 16 }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', padding: 12 }}>
        {open ? 'Chiudi ricarica' : 'Ricarica crediti'}
      </button>
      {open && (
        <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
          <label>
            Importo USD
            <input
              type="number"
              value={amountUsd}
              onChange={(e) => setAmountUsd(Number(e.target.value))}
              style={{ width: '100%', padding: 8 }}
            />
          </label>
          <label>
            Chain
            <select value={chain} onChange={(e) => setChain(e.target.value)} style={{ width: '100%', padding: 8 }}>
              {CHAINS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleCreate} style={{ padding: 12, borderRadius: 12 }}>
            Genera indirizzo
          </button>
          {paymentInfo && (
            <div style={{ background: '#1f2439', padding: 12, borderRadius: 12 }}>
              <p>Invia a: {paymentInfo.address}</p>
              {paymentInfo.memo && <p>Memo: {paymentInfo.memo}</p>}
              <p>Crediti previsti: {paymentInfo.credits}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

