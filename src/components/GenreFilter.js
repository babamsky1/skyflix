import React from 'react';

export default function GenreFilter({ genres = [], activeGenre, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
      <button onClick={() => onSelect(null)} style={{
        padding: '7px 16px', borderRadius: 20, border: '1px solid',
        borderColor: !activeGenre ? 'var(--accent)' : 'var(--border)',
        background: !activeGenre ? 'var(--accent-glow)' : 'transparent',
        color: !activeGenre ? 'var(--accent)' : 'var(--text-muted)',
        fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
      }}>All</button>
      {genres.map(g => (
        <button key={g.id} onClick={() => onSelect(g.id)} style={{
          padding: '7px 16px', borderRadius: 20, border: '1px solid',
          borderColor: activeGenre === g.id ? 'var(--accent)' : 'var(--border)',
          background: activeGenre === g.id ? 'var(--accent-glow)' : 'var(--bg-elevated)',
          color: activeGenre === g.id ? 'var(--accent)' : 'var(--text-muted)',
          fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
        }}>{g.name}</button>
      ))}
    </div>
  );
}
