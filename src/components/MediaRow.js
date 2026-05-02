import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import MediaCard from './MediaCard';

export default function MediaRow({ title, items = [], seeAllLink, mediaType }) {
  const rowRef = useRef();

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 640, behavior: 'smooth' });
    }
  };

  if (!items.length) return null;

  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: 1.5,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>{title}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {seeAllLink && (
            <Link to={seeAllLink} style={{
              fontSize: 13, color: 'var(--accent)', fontWeight: 600,
              padding: '5px 14px', borderRadius: 8, border: '1px solid var(--accent)',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-glow)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >See All →</Link>
          )}
          <button onClick={() => scroll(-1)} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <button onClick={() => scroll(1)} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
        </div>
      </div>
      <div ref={rowRef} style={{
        display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8,
        scrollbarWidth: 'none', msOverflowStyle: 'none',
      }}>
        {items.map(item => (
          <div key={item.id} style={{ flexShrink: 0, width: 180 }}>
            <MediaCard item={item} mediaType={mediaType || item.media_type} />
          </div>
        ))}
      </div>
      <style>{`.no-scroll::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}
