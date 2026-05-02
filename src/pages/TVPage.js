import React, { useState, useEffect } from 'react';
import MediaCard from '../components/MediaCard';
import GenreFilter from '../components/GenreFilter';
import Pagination from '../components/Pagination';
import { fetchTVGenres, discoverTV, fetchTopRatedTV, fetchPopularTV } from '../utils/api';

const TABS = [
  { id: 'popular', label: '🔥 Popular' },
  { id: 'top_rated', label: '⭐ Top Rated' },
  { id: 'discover', label: '🎯 Discover' },
];

export default function TVPage() {
  const [tab, setTab] = useState('popular');
  const [genre, setGenre] = useState(null);
  const [genres, setGenres] = useState([]);
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    fetchTVGenres().then(r => setGenres(r.data.genres || [])).catch(() => {});
  }, []);

  useEffect(() => { setPage(1); }, [tab, genre, sortBy]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let res;
        if (tab === 'popular') res = await fetchPopularTV(page);
        else if (tab === 'top_rated') res = await fetchTopRatedTV(page);
        else res = await discoverTV({ page, genre: genre || '', sort_by: sortBy });
        setShows(res.data.results || []);
        setTotalPages(res.data.total_pages || 1);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tab, page, genre, sortBy]);

  return (
    <div style={{ paddingTop: 90, paddingBottom: 60 }}>
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: 2, marginBottom: 8 }}>
            📺 TV Shows
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Explore series, documentaries, and more</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '9px 20px', borderRadius: 10, border: '1px solid',
              borderColor: tab === t.id ? 'var(--accent)' : 'var(--border)',
              background: tab === t.id ? 'var(--accent)' : 'var(--bg-elevated)',
              color: tab === t.id ? '#fff' : 'var(--text-muted)',
              fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
          {tab === 'discover' && (
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              marginLeft: 'auto', padding: '9px 16px', borderRadius: 10,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              color: 'var(--text)', fontSize: 14, cursor: 'pointer',
            }}>
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="first_air_date.desc">Newest</option>
            </select>
          )}
        </div>

        {tab === 'discover' && (
          <GenreFilter genres={genres} activeGenre={genre} onSelect={g => { setGenre(g); setPage(1); }} />
        )}

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <>
            <div className="media-grid">
              {shows.map(s => <MediaCard key={s.id} item={s} mediaType="tv" />)}
            </div>
            {!shows.length && (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📺</div>
                <p>No shows found. Try a different filter.</p>
              </div>
            )}
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
