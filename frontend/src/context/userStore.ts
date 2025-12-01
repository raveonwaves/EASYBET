import { create } from 'zustand';
import { api } from '../services/api';

type TelegramUser = {
  id: number;
  username?: string;
  first_name?: string;
};

type Content = {
  id: string;
  title: string;
  description: string;
  priceCredits: number;
  unlocked: boolean;
};

type State = {
  userId?: string;
  creditsBalance: number;
  contents: Content[];
  referralCode?: string;
  loading: boolean;
  initUser: (tgUser: TelegramUser, referralCode?: string) => Promise<void>;
  refreshContents: () => Promise<void>;
  refreshBalance: () => Promise<void>;
};

export const useUserStore = create<State>((set, get) => ({
  creditsBalance: 0,
  contents: [],
  loading: false,
  initUser: async (tgUser, referralCode) => {
    set({ loading: true });
    const { data } = await api.post('/user/init', { referralCode });
    set({
      userId: data.id,
      creditsBalance: data.creditsBalance,
      referralCode: data.referralCode,
      loading: false
    });
    await get().refreshContents();
  },
  refreshContents: async () => {
    const userId = get().userId;
    if (!userId) return;
    const { data } = await api.get('/content/list', { params: { userId } });
    set({ contents: data });
  },
  refreshBalance: async () => {
    const userId = get().userId;
    if (!userId) return;
    const { data } = await api.get('/user/balance', { params: { userId } });
    set({ creditsBalance: data.creditsBalance });
  }
}));

