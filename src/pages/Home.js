import React, { useEffect, useState } from 'react';
import HeroSlider from '../components/HeroSlider';
import MediaRow from '../components/MediaRow';
import { fetchTrendingMovies, fetchPopularMovies, fetchTopRatedMovies, fetchTrendingTV, fetchPopularTV } from '../utils/api';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, pm, tr, ttv, ptv] = await Promise.all([
          fetchTrendingMovies(),
          fetchPopularMovies(),
          fetchTopRatedMovies(),
          fetchTrendingTV(),
          fetchPopularTV(),
        ]);
        setTrending(t.data.results || []);
        setPopularMovies(pm.data.results || []);
        setTopRated(tr.data.results || []);
        setTrendingTV(ttv.data.results || []);
        setPopularTV(ptv.data.results || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
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

  return (
    <div style={{ paddingTop: 70 }}>
      <HeroSlider items={trending} />
      <div className="container" style={{ paddingTop: 60 }}>
        <MediaRow title="🔥 Trending Movies" items={popularMovies} seeAllLink="/movies" mediaType="movie" />
        <MediaRow title="⭐ Top Rated Movies" items={topRated} seeAllLink="/movies" mediaType="movie" />
        <MediaRow title="📺 Trending TV Shows" items={trendingTV} seeAllLink="/tv" mediaType="tv" />
        <MediaRow title="🎭 Popular TV Shows" items={popularTV} seeAllLink="/tv" mediaType="tv" />
      </div>
    </div>
  );
}
