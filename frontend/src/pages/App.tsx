import { useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { useUserStore } from '../context/userStore';
import { ContentList } from '../components/ContentList';
import { BalanceCard } from '../components/BalanceCard';
import { RechargeModal } from '../components/RechargeModal';
import { ReferralCard } from '../components/ReferralCard';
import { AdminPanel } from '../components/AdminPanel';

const App = () => {
  const { initDataUnsafe } = useTelegram();
  const initUser = useUserStore((state) => state.initUser);

  useEffect(() => {
    if (initDataUnsafe?.user) {
      void initUser(initDataUnsafe.user, initDataUnsafe?.start_param);
    }
  }, [initDataUnsafe, initUser]);

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <BalanceCard />
      <ContentList />
      <div style={{ marginTop: 24, display: 'grid', gap: 16 }}>
        <RechargeModal />
        <ReferralCard />
      </div>
      <AdminPanel />
    </div>
  );
};

export default App;

