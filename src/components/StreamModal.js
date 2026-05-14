import React, { useEffect, useState } from 'react';

const STREAMING_PROVIDERS = [
  { id: 'vidsrc', name: 'VidSrc', url: 'https://vidsrc.xyz' },
  { id: 'vidsrc_to', name: 'VidSrc.to', url: 'https://vidsrc.to' },
  { id: 'embed2', name: '2Embed', url: 'https://www.2embed.cc' },
  { id: 'vidsrc_me', name: 'VidSrc.me', url: 'https://vidsrc.me' },
  { id: 'movies123', name: 'Movies123', url: 'https://movies123.to' },
  { id: 'putlocker', name: 'Putlocker', url: 'https://putlocker.to' },
  { id: 'solarmovie', name: 'SolarMovie', url: 'https://solarmovie.to' },
  { id: 'fmovies', name: 'FMovies', url: 'https://fmovies.to' },
];

export default function StreamModal({ embedUrl, title, onClose, onProviderChange, currentProvider = 'vidsrc', mediaType, mediaId }) {
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(currentProvider);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div onClick={onClose} className="stream-overlay">
      <div onClick={e => e.stopPropagation()} className="stream-container">
        {/* Top bar */}
        <div className="stream-topbar">
          <div className="stream-topbar-left">
            <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Now Playing</span>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>
          </div>
          <div className="stream-topbar-right">
            <select
              value={selectedProvider}
              onChange={(e) => {
                const newProvider = e.target.value;
                setSelectedProvider(newProvider);
                setLoading(true);
                setPlayerReady(false);
                if (onProviderChange) onProviderChange(newProvider);
              }}
              className="stream-provider-select"
            >
              {STREAMING_PROVIDERS.map(provider => (
                <option key={provider.id} value={provider.id}>{provider.name}</option>
              ))}
            </select>
            <button onClick={onClose} className="stream-close-btn">
              <span>✕</span>
            </button>
          </div>
        </div>

        {/* Player */}
        <div className="stream-player-wrap">
          {loading && (
            <div className="stream-loading">
              <div className="spinner" />
              <p style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)' }}>Loading stream...</p>
            </div>
          )}
          <iframe
            src={embedUrl}
            title={title}
            allowFullScreen
            className={`stream-iframe ${playerReady ? 'stream-iframe-ready' : ''}`}
            onLoad={() => { setLoading(false); setPlayerReady(true); }}
          />
        </div>

        {/* Bottom info */}
        <div className="stream-bottombar">
          <span>Press <kbd>ESC</kbd> to close</span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span>Change provider if stream doesn't load</span>
        </div>
      </div>
    </div>
  );
}
