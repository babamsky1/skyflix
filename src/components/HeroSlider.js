import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getBackdropUrl, getImageUrl } from '../utils/api';

export default function HeroSlider({ items = [] }) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const featured = items.slice(0, 6);

  const go = useCallback((idx) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 300);
  }, [transitioning]);

  useEffect(() => {
    if (featured.length < 2) return;
    const interval = setInterval(() => {
      go((current + 1) % featured.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [current, featured.length, go]);

  if (!featured.length) return null;

  const item = featured[current];
  const isMovie = item.title || item.media_type === 'movie';
  const type = isMovie ? 'movie' : 'tv';
  const title = item.title || item.name || '';
  const rating = item.vote_average?.toFixed(1) || 'N/A';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);

  return (
    <div style={{ position: 'relative', height: 'min(620px, 85vh)', overflow: 'hidden', marginTop: 0 }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: transitioning ? 0 : 1,
        transition: 'opacity 0.5s ease',
      }}>
        {getBackdropUrl(item.backdrop_path) ? (
          <img src={getBackdropUrl(item.backdrop_path)} alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--surface)' }} />
        )}
        {/* Gradient overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,15,0.95) 30%, rgba(10,10,15,0.3) 70%, transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg) 0%, transparent 50%)' }} />
      </div>

      {/* Content */}
      <div className="container" style={{
        position: 'relative', height: '100%',
        display: 'flex', alignItems: 'center', paddingTop: '70px',
      }}>
        <div style={{
          maxWidth: 560,
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'translateY(10px)' : 'translateY(0)',
          transition: 'all 0.5s ease',
        }}>
          <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className={`badge badge-${type}`}>{type === 'movie' ? '🎬 Movie' : '📺 TV Show'}</span>
            {year && <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{year}</span>}
            <span style={{
              background: 'rgba(255,214,10,0.15)', color: 'var(--gold)',
              border: '1px solid rgba(255,214,10,0.3)',
              borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600,
            }}>⭐ {rating}</span>
          </div>

          <h1 style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 'clamp(40px, 6vw, 72px)',
            letterSpacing: 2, lineHeight: 0.95,
            marginBottom: 16, textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}>{title}</h1>

          {item.overview && (
            <p style={{
              fontSize: 15, lineHeight: 1.7, color: 'rgba(240,240,255,0.75)',
              marginBottom: 28,
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{item.overview}</p>
          )}

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to={`/${type}/${item.id}`} style={{
              padding: '12px 28px', background: 'var(--accent)', color: '#fff',
              borderRadius: 10, fontWeight: 600, fontSize: 15,
              boxShadow: '0 4px 20px var(--accent-glow)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px var(--accent-glow)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px var(--accent-glow)'; }}
            >▶ Watch Trailer</Link>

            <Link to={`/${type}/${item.id}`} style={{
              padding: '12px 28px', background: 'rgba(255,255,255,0.1)', color: '#fff',
              borderRadius: 10, fontWeight: 600, fontSize: 15,
              border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>ℹ Details</Link>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
        {featured.map((_, i) => (
          <button key={i} onClick={() => go(i)} style={{
            width: i === current ? 28 : 8, height: 8,
            borderRadius: 4, border: 'none', cursor: 'pointer',
            background: i === current ? 'var(--accent)' : 'rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease', padding: 0,
          }} />
        ))}
      </div>

      {/* Poster thumbnails - desktop */}
      <div style={{
        position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 8,
      }} className="hero-thumbs">
        {featured.map((f, i) => (
          <button key={f.id} onClick={() => go(i)} style={{
            width: 52, height: 78, borderRadius: 6, overflow: 'hidden',
            border: i === current ? '2px solid var(--accent)' : '2px solid transparent',
            opacity: i === current ? 1 : 0.5, transition: 'all 0.2s',
            background: 'var(--surface)', cursor: 'pointer', padding: 0,
            flexShrink: 0,
          }}>
            {getImageUrl(f.poster_path, 'w92') && (
              <img src={getImageUrl(f.poster_path, 'w92')} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </button>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) { .hero-thumbs { display: none; } }
      `}</style>
    </div>
  );
}
