import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      inputRef.current?.blur();
    }
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'var(--bg-card)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s ease',
      height: '70px',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%', gap: '24px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, background: 'var(--accent)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Bebas Neue', cursive", fontSize: 20, color: '#fff',
            boxShadow: '0 0 20px var(--accent-glow)',
          }}>S</div>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 2, color: 'var(--text)' }}>
            STREAM<span style={{ color: 'var(--accent)' }}>VAULT</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }} className="desktop-nav">
          {[['/', 'Home'], ['/movies', 'Movies'], ['/tv', 'TV Shows']].map(([path, label]) => (
            <Link key={path} to={path} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              color: location.pathname === path ? 'var(--accent)' : 'var(--text-muted)',
              background: location.pathname === path ? 'var(--accent-glow)' : 'transparent',
              transition: 'all 0.2s',
            }}>{label}</Link>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 360 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16 }}>🔍</span>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search movies & shows..."
              style={{
                width: '100%', padding: '9px 12px 9px 38px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 10, color: 'var(--text)', fontSize: 14,
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          {/* Theme toggle */}
          <button onClick={toggleTheme} style={{
            width: 38, height: 38, borderRadius: 10, border: '1px solid var(--border)',
            background: 'var(--bg-elevated)', color: 'var(--text)', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{isDark ? '☀️' : '🌙'}</button>

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(p => !p)} className="mobile-only" style={{
            width: 38, height: 38, borderRadius: 10, border: '1px solid var(--border)',
            background: 'var(--bg-elevated)', color: 'var(--text)', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>☰</button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '70px', left: 0, right: 0,
          background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
          padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {[['/', 'Home'], ['/movies', 'Movies'], ['/tv', 'TV Shows']].map(([path, label]) => (
            <Link key={path} to={path} style={{ padding: '10px 14px', borderRadius: 8, fontWeight: 500, color: 'var(--text)' }}>{label}</Link>
          ))}
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-only { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
