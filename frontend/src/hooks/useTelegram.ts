import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram?: any;
  }
}

export const useTelegram = () => {
  const [initDataUnsafe, setInitDataUnsafe] = useState<any>();

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      setInitDataUnsafe(window.Telegram.WebApp.initDataUnsafe);
    }
  }, []);

  return { initDataUnsafe };
};

