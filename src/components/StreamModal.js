import React, { useEffect, useState } from 'react';

export default function StreamModal({ embedUrl, title, onClose }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 1200,
          background: '#000',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          background: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border)',
        }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 4,
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
          {loading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}>
              <div className="spinner" />
            </div>
          )}
          <iframe
            src={embedUrl}
            title={title}
            allowFullScreen
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            onLoad={() => setLoading(false)}
          />
        </div>

        <div style={{
          padding: '12px 20px',
          background: 'var(--bg-elevated)',
          borderTop: '1px solid var(--border)',
          fontSize: 13,
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}>
          Streaming provided by third-party embed providers. Press ESC to close.
        </div>
      </div>
    </div>
  );
}
