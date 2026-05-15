import React, { useEffect, useState } from 'react';
import HeroSlider from '../components/HeroSlider';
import MediaRow from '../components/MediaRow';
import { fetchTrendingMovies, fetchPopularMovies, fetchTopRatedMovies, fetchTrendingTV, fetchPopularTV } from '../utils/api';

const wrap = (p) =>
  p.then(r => ({ data: r.data.results || [] })).catch(err => {
    console.error('Section failed to load:', err);
    return { data: [] };
  });

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoadError(false);
    const load = async () => {
      try {
        const [t, pm, tr, ttv, ptv] = await Promise.allSettled([
          wrap(fetchTrendingMovies()),
          wrap(fetchPopularMovies()),
          wrap(fetchTopRatedMovies()),
          wrap(fetchTrendingTV()),
          wrap(fetchPopularTV()),
        ]);
        setTrending(t.value?.data || []);
        setPopularMovies(pm.value?.data || []);
        setTopRated(tr.value?.data || []);
        setTrendingTV(ttv.value?.data || []);
        setPopularTV(ptv.value?.data || []);
        if (!t.value?.data.length && !pm.value?.data.length) setLoadError(true);
      } catch (err) {
        console.error('Failed to load home data:', err);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div style={{ paddingTop: 70 }}>
      <div style={{ height: 'min(620px, 85vh)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <div className="spinner" />
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 16 }}>Loading amazing content…</p>
        </div>
      </div>
    </div>
  );

  if (loadError) {
    return (
      <div style={{ paddingTop: 70 }}>
        <div style={{ height: 'min(620px, 85vh)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Could not load content. The server may be starting up.</p>
            <button onClick={() => window.location.reload()} style={{
              padding: '10px 24px', background: 'var(--accent)', color: '#fff',
              borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 70 }}>
      <HeroSlider items={trending} />
      <div className="container" style={{ paddingTop: 60 }}>
        {popularMovies.length > 0 && <MediaRow title="🔥 Trending Movies" items={popularMovies} seeAllLink="/movies" mediaType="movie" />}
        {topRated.length > 0 && <MediaRow title="⭐ Top Rated Movies" items={topRated} seeAllLink="/movies" mediaType="movie" />}
        {trendingTV.length > 0 && <MediaRow title="📺 Trending TV Shows" items={trendingTV} seeAllLink="/tv" mediaType="tv" />}
        {popularTV.length > 0 && <MediaRow title="🎭 Popular TV Shows" items={popularTV} seeAllLink="/tv" mediaType="tv" />}
      </div>
    </div>
  );
}