import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/api';

export default function MediaCard({ item, mediaType }) {
  const [imgError, setImgError] = useState(false);
  const isMovie = mediaType === 'movie' || item.media_type === 'movie' || item.title;
  const type = isMovie ? 'movie' : 'tv';
  const title = item.title || item.name || 'Unknown';
  const rating = item.vote_average?.toFixed(1) || 'N/A';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const imgUrl = getImageUrl(item.poster_path, 'w342');

  const ratingColor = rating >= 7.5 ? '#06d6a0' : rating >= 6 ? '#ffd60a' : '#e63946';

  return (
    <Link to={`/${type}/${item.id}`} style={{ display: 'block' }}>
      <div style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius)',
        overflow: 'hidden', border: '1px solid var(--border)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
          e.currentTarget.style.borderColor = 'var(--accent)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        {/* Poster */}
        <div style={{ position: 'relative', aspectRatio: '2/3', background: 'var(--surface)', overflow: 'hidden' }}>
          {imgUrl && !imgError ? (
            <img src={imgUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImgError(true)} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 40 }}>🎬</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '0 8px' }}>{title}</span>
            </div>
          )}
          {/* Rating badge */}
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            borderRadius: 6, padding: '3px 8px',
            fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500,
            color: ratingColor, border: `1px solid ${ratingColor}40`,
          }}>⭐ {rating}</div>
          {/* Type badge */}
          <div style={{ position: 'absolute', top: 8, left: 8 }}>
            <span className={`badge badge-${type}`}>{type === 'movie' ? '🎬' : '📺'} {type === 'movie' ? 'Movie' : 'TV'}</span>
          </div>
        </div>
        {/* Info */}
        <div style={{ padding: '12px' }}>
          <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3, marginBottom: 4,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {title}
          </div>
          {year && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{year}</div>}
        </div>
      </div>
    </Link>
  );
}
