import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-card)', borderTop: '1px solid var(--border)',
      padding: '40px 0 24px',
      marginTop: 80,
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 2, marginBottom: 12 }}>
              STREAM<span style={{ color: 'var(--accent)' }}>VAULT</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Discover movies and TV shows. Powered by TMDb. Trailers only — no illegal streaming.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Browse</div>
            {[['/', 'Home'], ['/movies', 'Movies'], ['/tv', 'TV Shows']].map(([path, label]) => (
              <Link key={path} to={path} style={{ display: 'block', fontSize: 14, color: 'var(--text-muted)', marginBottom: 8, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >{label}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Data Source</div>
            <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer"
              style={{ fontSize: 14, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
              The Movie Database (TMDb)
            </a>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              This product uses the TMDb API but is not endorsed or certified by TMDb.
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>© {new Date().getFullYear()} StreamVault. For educational purposes only.</span>
          <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
            alt="TMDb" style={{ height: 16, opacity: 0.6 }} />
        </div>
      </div>
    </footer>
  );
}
