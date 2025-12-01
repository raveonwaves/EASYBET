import { useState } from 'react';
import { api } from '../services/api';

export const AdminPanel = () => {
  const [token, setToken] = useState('');
  const [content, setContent] = useState({
    title: '',
    description: '',
    priceCredits: 100,
    assetKey: '',
    storagePath: ''
  });

  const handleSubmit = async () => {
    await api.post(
      '/admin/content/add',
      { ...content },
      {
        headers: { 'x-admin-token': token }
      }
    );
    alert('Contenuto creato');
  };

  return (
    <div style={{ marginTop: 32, background: '#241f30', padding: 16, borderRadius: 16 }}>
      <h3>Admin panel</h3>
      <input
        placeholder="Admin token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        placeholder="Titolo"
        value={content.title}
        onChange={(e) => setContent({ ...content, title: e.target.value })}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <textarea
        placeholder="Descrizione"
        value={content.description}
        onChange={(e) => setContent({ ...content, description: e.target.value })}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        placeholder="Crediti"
        type="number"
        value={content.priceCredits}
        onChange={(e) => setContent({ ...content, priceCredits: Number(e.target.value) })}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        placeholder="Asset key"
        value={content.assetKey}
        onChange={(e) => setContent({ ...content, assetKey: e.target.value })}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        placeholder="Storage path"
        value={content.storagePath}
        onChange={(e) => setContent({ ...content, storagePath: e.target.value })}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <button onClick={handleSubmit} style={{ padding: 12, borderRadius: 12 }}>
        Carica contenuto
      </button>
    </div>
  );
};

