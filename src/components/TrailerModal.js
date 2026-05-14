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
    <div onClick={onClose} className="stream-overlay" style={{ zIndex: 2000 }}>
      <div onClick={e => e.stopPropagation()} className="stream-container" style={{ maxWidth: 960 }}>
        <div className="stream-topbar">
          <div className="stream-topbar-left">
            <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Official Trailer</span>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>
          </div>
          <div className="stream-topbar-right">
            <button onClick={onClose} className="stream-close-btn">
              <span>✕</span>
            </button>
          </div>
        </div>
        <div className="stream-player-wrap">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
            title={`${title} Trailer`}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            className="stream-iframe stream-iframe-ready"
            style={{ aspectRatio: '16/9' }}
          />
        </div>
        <div className="stream-bottombar">
          <span>Press <kbd>ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
