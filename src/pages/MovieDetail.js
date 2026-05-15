import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { warmupServer, fetchMovieDetail, fetchMovieVideos, fetchMovieStream, getImageUrl, getBackdropUrl } from '../utils/api';
import TrailerModal from '../components/TrailerModal';
import StreamModal from '../components/StreamModal';
import MediaCard from '../components/MediaCard';

const SECTION_HEADER = { fontWeight: 700, fontSize: 18, marginBottom: 16, letterSpacing: '-0.3px' };
const TITLE_STYLE = { fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 8, lineHeight: 1.1 };

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [currentProvider, setCurrentProvider] = useState('vidsrc');
  const [expandedOverview, setExpandedOverview] = useState(false);

  const handleWatchNow = async () => {
    try {
      const res = await fetchMovieStream(id, currentProvider);
      setStreamUrl(res.data.embed_url);
    } catch (err) {
      console.error('Failed to get stream URL:', err);
      alert('Failed to load stream. Please try another provider.');
    }
  };

  const handleProviderChange = async (newProvider) => {
    setCurrentProvider(newProvider);
    try {
      const res = await fetchMovieStream(id, newProvider);
      setStreamUrl(res.data.embed_url);
    } catch (err) {
      console.error('Failed to get stream URL:', err);
      alert('Failed to load stream. Please try another provider.');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      setLoading(true);
      try {
        for (let attempt = 0; attempt < 2; attempt++) {
          try { await warmupServer(); break; }
          catch { await new Promise(r => setTimeout(r, 2000)); }
        }
        const [mRes, vRes] = await Promise.all([fetchMovieDetail(id), fetchMovieVideos(id)]);
        setMovie(mRes.data);
        setVideos(vRes.data.results || []);
      } catch (err) { 
        console.error('Error loading movie:', err);
        alert('Failed to load movie details. Please try again.');
      }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <div style={{ paddingTop: 70 }}><div className="loading-center"><div className="spinner" /></div></div>;
  if (!movie) return <div style={{ paddingTop: 120, textAlign: 'center' }}>Movie not found.</div>;

  const trailer = videos.find(v => v.type === 'Trailer') || videos[0];
  const rating = movie.vote_average?.toFixed(1);
  const ratingColor = rating >= 7.5 ? '#06d6a0' : rating >= 6 ? '#ffd60a' : '#e63946';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;
  const similar = movie.similar?.results?.slice(0, 12) || [];
  const recommended = movie.recommendations?.results?.slice(0, 12) || [];
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  const overviewText = movie.overview || 'No overview available.';
  const isLongOverview = overviewText.length > 300;

  return (
    <div style={{ paddingTop: 70 }}>
      {/* Subtle backdrop banner */}
      <div style={{
        position: 'relative', height: 280, overflow: 'hidden',
        background: 'var(--bg-card)',
      }}>
        {getBackdropUrl(movie.backdrop_path) ? (
          <img src={getBackdropUrl(movie.backdrop_path)} alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4) saturate(1.2)', opacity: 0.6 }} />
        ) : null}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, var(--bg) 100%)' }} />
      </div>

      <div className="container" style={{ marginTop: -160, position: 'relative', zIndex: 1 }}>
        {/* Hero section: poster + info */}
        <div className="detail-hero">
          {/* Poster */}
          <div className="detail-poster">
            {getImageUrl(movie.poster_path) ? (
              <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
            ) : (
              <div className="detail-poster-fallback">🎬</div>
            )}
          </div>

          {/* Info column */}
          <div className="detail-info">
            <div className="detail-badges">
              <span className="badge badge-movie">🎬 Movie</span>
              {movie.genres?.map(g => (
                <span key={g.id} className="detail-genre-tag">{g.name}</span>
              ))}
            </div>

            <h1 style={TITLE_STYLE}>{movie.title}</h1>

            {movie.tagline && <p className="detail-tagline">"{movie.tagline}"</p>}

            <div className="detail-meta">
              <div className="detail-rating" style={{ color: ratingColor }}>
                <span className="detail-star">★</span>
                <div>
                  <div className="detail-rating-value">{rating}</div>
                  <div className="detail-rating-label">{movie.vote_count?.toLocaleString()} votes</div>
                </div>
              </div>
              {movie.release_date && (
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Release</span>
                  <span>{new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
              {runtime && (
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Runtime</span>
                  <span>{runtime}</span>
                </div>
              )}
              {movie.status && (
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Status</span>
                  <span>{movie.status}</span>
                </div>
              )}
            </div>

            <div className="detail-actions">
              <button onClick={handleWatchNow} className="btn btn-primary">
                ▶ Watch Now
              </button>
              {trailer && (
                <button onClick={() => setTrailerKey(trailer.key)} className="btn btn-accent">
                  ▶ Trailer
                </button>
              )}
              {movie.homepage && (
                <a href={movie.homepage} target="_blank" rel="noreferrer" className="btn btn-outline">
                  Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content sections (scrollable, no tabs) */}
        <div className="detail-sections">
          {/* Overview */}
          <section className="detail-section">
            <h3 style={SECTION_HEADER}>Overview</h3>
            <p className={`detail-overview-text ${!expandedOverview && isLongOverview ? 'detail-overview-clamped' : ''}`}>
              {overviewText}
            </p>
            {isLongOverview && (
              <button onClick={() => setExpandedOverview(v => !v)} className="detail-expand-btn">
                {expandedOverview ? 'Show less' : 'Read more'}
              </button>
            )}
            {(movie.budget > 0 || movie.revenue > 0) && (
              <div className="detail-financials">
                {movie.budget > 0 && (
                  <div className="detail-fin-item">
                    <span className="detail-meta-label">Budget</span>
                    <span className="detail-fin-value">${movie.budget.toLocaleString()}</span>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div className="detail-fin-item">
                    <span className="detail-meta-label">Revenue</span>
                    <span className="detail-fin-value">${movie.revenue.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Cast */}
          {cast.length > 0 && (
            <section className="detail-section">
              <h3 style={SECTION_HEADER}>Cast</h3>
              <div className="detail-cast-scroll">
                {cast.map(c => (
                  <div key={c.id} className="detail-cast-card">
                    {getImageUrl(c.profile_path, 'w185') ? (
                      <img src={getImageUrl(c.profile_path, 'w185')} alt={c.name} className="detail-cast-img" />
                    ) : (
                      <div className="detail-cast-img detail-cast-img-fallback">👤</div>
                    )}
                    <div className="detail-cast-name">{c.name}</div>
                    <div className="detail-cast-char">{c.character}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <section className="detail-section">
              <h3 style={SECTION_HEADER}>Videos</h3>
              <div className="detail-videos-grid">
                {videos.map(v => (
                  <div key={v.key} onClick={() => setTrailerKey(v.key)} className="detail-video-card">
                    <div className="detail-video-thumb-wrap">
                      <img src={`https://img.youtube.com/vi/${v.key}/mqdefault.jpg`} alt={v.name} className="detail-video-thumb" />
                      <div className="detail-video-play"><span>▶</span></div>
                    </div>
                    <div className="detail-video-info">
                      <div className="detail-video-name">{v.name}</div>
                      <div className="detail-video-type">{v.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Similar */}
          {similar.length > 0 && (
            <section className="detail-section">
              <h3 style={SECTION_HEADER}>Similar Movies</h3>
              <div className="media-grid">
                {similar.map(m => <MediaCard key={m.id} item={m} mediaType="movie" />)}
              </div>
            </section>
          )}

          {/* Recommended */}
          {recommended.length > 0 && (
            <section className="detail-section">
              <h3 style={SECTION_HEADER}>You Might Also Like</h3>
              <div className="media-grid">
                {recommended.map(m => <MediaCard key={m.id} item={m} mediaType="movie" />)}
              </div>
            </section>
          )}
        </div>
      </div>

      {trailerKey && <TrailerModal videoKey={trailerKey} title={movie.title} onClose={() => setTrailerKey(null)} />}
      {streamUrl && <StreamModal embedUrl={streamUrl} title={movie.title} onClose={() => setStreamUrl(null)} onProviderChange={handleProviderChange} currentProvider={currentProvider} mediaType="movie" mediaId={id} />}
      <div style={{ height: 80 }} />
    </div>
  );
}
