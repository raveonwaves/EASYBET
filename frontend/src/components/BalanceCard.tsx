import { useUserStore } from '../context/userStore';

export const BalanceCard = () => {
  const { creditsBalance } = useUserStore();
  return (
    <div style={{ background: '#141826', padding: 16, borderRadius: 16 }}>
      <p style={{ margin: 0, color: '#9ca3c7' }}>Saldo crediti</p>
      <h1 style={{ margin: 0 }}>{creditsBalance}</h1>
    </div>
  );
};

