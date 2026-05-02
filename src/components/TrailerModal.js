import React, { useEffect } from 'react';

export default function TrailerModal({ videoKey, title, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 960,
        background: 'var(--bg-card)', borderRadius: 16,
        border: '1px solid var(--border)',
        overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.8)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Official Trailer</div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{title}</div>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)',
            background: 'var(--bg-elevated)', color: 'var(--text)', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>✕</button>
        </div>
        {/* Video */}
        <div style={{ aspectRatio: '16/9', background: '#000' }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
            title={`${title} Trailer`}
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
