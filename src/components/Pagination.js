import React from 'react';

export default function Pagination({ page, totalPages, onPageChange }) {
  const maxPages = Math.min(totalPages, 500);
  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(maxPages, page + delta); i++) {
    pages.push(i);
  }

  const btn = (label, onClick, active, disabled) => (
    <button key={label} onClick={onClick} disabled={disabled} style={{
      padding: '8px 14px', borderRadius: 8, border: '1px solid',
      borderColor: active ? 'var(--accent)' : 'var(--border)',
      background: active ? 'var(--accent)' : 'var(--bg-elevated)',
      color: active ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--text)',
      fontWeight: active ? 700 : 500, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
    }}>{label}</button>
  );

  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40 }}>
      {btn('‹ Prev', () => onPageChange(page - 1), false, page <= 1)}
      {pages[0] > 1 && <>{btn(1, () => onPageChange(1), false, false)}{pages[0] > 2 && <span style={{ alignSelf: 'center', color: 'var(--text-muted)' }}>…</span>}</>}
      {pages.map(p => btn(p, () => onPageChange(p), p === page, false))}
      {pages[pages.length - 1] < maxPages && <>{pages[pages.length - 1] < maxPages - 1 && <span style={{ alignSelf: 'center', color: 'var(--text-muted)' }}>…</span>}{btn(maxPages, () => onPageChange(maxPages), false, false)}</>}
      {btn('Next ›', () => onPageChange(page + 1), false, page >= maxPages)}
    </div>
  );
}
