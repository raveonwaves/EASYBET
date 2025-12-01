import { useUserStore } from '../context/userStore';
import { api } from '../services/api';

export const ContentList = () => {
  const { contents, userId, refreshContents, refreshBalance } = useUserStore();

  const handleUnlock = async (contentId: string) => {
    await api.post('/content/unlock', { userId, contentId });
    await refreshContents();
    await refreshBalance();
  };

  return (
    <div style={{ marginTop: 24 }}>
      {contents.map((content) => (
        <div
          key={content.id}
          style={{
            background: '#1c2033',
            padding: 16,
            borderRadius: 16,
            marginBottom: 16
          }}
        >
          <h3 style={{ marginTop: 0 }}>{content.title}</h3>
          <p style={{ color: '#a3a5b0' }}>{content.description}</p>
          {content.unlocked ? (
            <span style={{ color: '#4ade80' }}>Sbloccato</span>
          ) : (
            <button
              style={{
                padding: '8px 16px',
                borderRadius: 12,
                border: 'none',
                background: '#6366f1',
                color: '#fff'
              }}
              onClick={() => handleUnlock(content.id)}
            >
              Sblocca ({content.priceCredits} crediti)
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

