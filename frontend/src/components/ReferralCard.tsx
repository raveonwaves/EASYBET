import { useUserStore } from '../context/userStore';

export const ReferralCard = () => {
  const { referralCode } = useUserStore();
  const link = `https://t.me/${import.meta.env.VITE_TELEGRAM_BOT_NAME}?start=${referralCode}`;
  return (
    <div style={{ background: '#141826', padding: 16, borderRadius: 16 }}>
      <p>Invita un amico</p>
      <p style={{ fontWeight: 'bold' }}>{referralCode}</p>
      <button
        style={{ padding: 12, borderRadius: 12 }}
        onClick={() => navigator.clipboard.writeText(link)}
      >
        Copia link
      </button>
    </div>
  );
};

