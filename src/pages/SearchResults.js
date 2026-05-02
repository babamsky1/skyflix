import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchContent } from '../utils/api';
import MediaCard from '../components/MediaCard';
import Pagination from '../components/Pagination';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [filter, setFilter] = useState('multi');

  const doSearch = useCallback(async (q, p, type) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await searchContent(q, p, type);
      const data = res.data;
      const filtered = (data.results || []).filter(r => r.media_type !== 'person' && (r.poster_path || r.backdrop_path));
      setResults(filtered);
      setTotalPages(data.total_pages || 1);
      setTotalResults(data.total_results || 0);
    } catch (err) { console.error(err); setResults([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, filter]);

  useEffect(() => {
    doSearch(query, page, filter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [query, page, filter, doSearch]);

  const filterTypes = [
    { id: 'multi', label: '🎯 All' },
    { id: 'movie', label: '🎬 Movies' },
    { id: 'tv', label: '📺 TV Shows' },
  ];

  return (
    <div style={{ paddingTop: 90, paddingBottom: 60 }}>
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: 2, marginBottom: 8 }}>
            Search Results
          </h1>
          {query && (
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
              {loading ? 'Searching…' : `${totalResults.toLocaleString()} results for `}
              {!loading && <strong style={{ color: 'var(--text)' }}>"{query}"</strong>}
            </p>
          )}
        </div>

        {/* Type filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {filterTypes.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              padding: '9px 20px', borderRadius: 10, border: '1px solid',
              borderColor: filter === t.id ? 'var(--accent)' : 'var(--border)',
              background: filter === t.id ? 'var(--accent)' : 'var(--bg-elevated)',
              color: filter === t.id ? '#fff' : 'var(--text-muted)',
              fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>

        {!query && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <h2 style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: 2, fontSize: 28, marginBottom: 8 }}>Search for anything</h2>
            <p style={{ color: 'var(--text-muted)' }}>Find movies and TV shows using the search bar above</p>
          </div>
        )}

        {query && loading && <div className="loading-center"><div className="spinner" /></div>}

        {query && !loading && (
          <>
            <div className="media-grid">
              {results.map(item => (
                <MediaCard key={`${item.media_type || filter}-${item.id}`} item={item}
                  mediaType={filter === 'multi' ? item.media_type : filter} />
              ))}
            </div>
            {!results.length && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
                <h3 style={{ marginBottom: 8 }}>No results found</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try different keywords or check your spelling</p>
              </div>
            )}
            {results.length > 0 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
          </>
        )}
      </div>
    </div>
  );
}
