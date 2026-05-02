import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetail, fetchMovieVideos, fetchMovieStream, getImageUrl, getBackdropUrl } from '../utils/api';
import TrailerModal from '../components/TrailerModal';
import StreamModal from '../components/StreamModal';
import MediaCard from '../components/MediaCard';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [streamUrl, setStreamUrl] = useState(null);
  const [streamProvider, setStreamProvider] = useState('vidsrc');

  const handleWatchNow = async () => {
    try {
      const res = await fetchMovieStream(id, streamProvider);
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

  return (
    <div style={{ paddingTop: 70 }}>
      {/* Backdrop */}
      <div style={{ position: 'relative', height: 'min(500px, 70vh)', overflow: 'hidden' }}>
        {getBackdropUrl(movie.backdrop_path) ? (
          <img src={getBackdropUrl(movie.backdrop_path)} alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : <div style={{ width: '100%', height: '100%', background: 'var(--surface)' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, var(--bg) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,15,0.8) 0%, transparent 60%)' }} />
      </div>

      <div className="container" style={{ marginTop: -200, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Poster */}
          <div style={{ flexShrink: 0, width: 240, borderRadius: 14, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', border: '1px solid var(--border)' }}>
            {getImageUrl(movie.poster_path) ? (
              <img src={getImageUrl(movie.poster_path)} alt={movie.title} style={{ width: '100%', display: 'block' }} />
            ) : (
              <div style={{ width: 240, height: 360, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>🎬</div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="badge badge-movie">🎬 Movie</span>
              {movie.genres?.map(g => (
                <span key={g.id} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{g.name}</span>
              ))}
            </div>

            <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(32px, 5vw, 60px)', letterSpacing: 2, marginBottom: 8, lineHeight: 0.95 }}>{movie.title}</h1>

            {movie.tagline && <p style={{ fontSize: 16, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 16 }}>"{movie.tagline}"</p>}

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 22, color: ratingColor }}>⭐</span>
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700, color: ratingColor }}>{rating}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{movie.vote_count?.toLocaleString()} votes</div>
                </div>
              </div>
              {movie.release_date && <div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Release</div><div style={{ fontWeight: 600 }}>{new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div></div>}
              {runtime && <div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Runtime</div><div style={{ fontWeight: 600 }}>{runtime}</div></div>}
              {movie.status && <div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Status</div><div style={{ fontWeight: 600 }}>{movie.status}</div></div>}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
              <button onClick={handleWatchNow} style={{
                padding: '12px 28px', background: '#06d6a0', color: '#fff',
                borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(6, 214, 160, 0.4)', display: 'flex', alignItems: 'center', gap: 8,
              }}>▶ Watch Now</button>
              {trailer && (
                <button onClick={() => setTrailerKey(trailer.key)} style={{
                  padding: '12px 28px', background: 'var(--accent)', color: '#fff',
                  borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                  boxShadow: '0 4px 20px var(--accent-glow)', display: 'flex', alignItems: 'center', gap: 8,
                }}>▶ Watch Trailer</button>
              )}
              {movie.homepage && (
                <a href={movie.homepage} target="_blank" rel="noreferrer" style={{
                  padding: '12px 20px', background: 'var(--bg-elevated)', color: 'var(--text)',
                  borderRadius: 10, border: '1px solid var(--border)', fontWeight: 600, fontSize: 15,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>🌐 Website</a>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop: 40, borderBottom: '1px solid var(--border)', marginBottom: 32, display: 'flex', gap: 4 }}>
          {['overview', 'cast', 'videos', 'similar', 'recommended'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === t ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === t ? 'var(--accent)' : 'transparent'}`,
              fontWeight: 600, fontSize: 14, textTransform: 'capitalize', marginBottom: -1,
              transition: 'all 0.2s',
            }}>{t}</button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div style={{ maxWidth: 800 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 18 }}>Overview</h3>
            <p style={{ lineHeight: 1.8, color: 'var(--text-muted)', fontSize: 15 }}>{movie.overview || 'No overview available.'}</p>
            {movie.budget > 0 && <div style={{ marginTop: 24, display: 'flex', gap: 32 }}>
              <div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Budget</div><div style={{ fontWeight: 700, fontSize: 16 }}>${movie.budget?.toLocaleString()}</div></div>
              {movie.revenue > 0 && <div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Revenue</div><div style={{ fontWeight: 700, fontSize: 16 }}>${movie.revenue?.toLocaleString()}</div></div>}
            </div>}
          </div>
        )}

        {activeTab === 'cast' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16 }}>
            {cast.map(c => (
              <div key={c.id} style={{ textAlign: 'center', background: 'var(--bg-card)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                {getImageUrl(c.profile_path, 'w185') ? (
                  <img src={getImageUrl(c.profile_path, 'w185')} alt={c.name} style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '2/3', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>👤</div>
                )}
                <div style={{ padding: '10px 8px' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.character}</div>
                </div>
              </div>
            ))}
            {!cast.length && <p style={{ color: 'var(--text-muted)' }}>No cast information available.</p>}
          </div>
        )}

        {activeTab === 'videos' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {videos.map(v => (
              <div key={v.key} onClick={() => setTrailerKey(v.key)} style={{
                borderRadius: 10, overflow: 'hidden', cursor: 'pointer', position: 'relative',
                border: '1px solid var(--border)', background: 'var(--bg-card)',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <img src={`https://img.youtube.com/vi/${v.key}/mqdefault.jpg`} alt={v.name} style={{ width: '100%', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 50, height: 50, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>▶</div>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{v.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{v.type}</div>
                </div>
              </div>
            ))}
            {!videos.length && <p style={{ color: 'var(--text-muted)' }}>No videos available.</p>}
          </div>
        )}

        {activeTab === 'similar' && (
          <div className="media-grid">
            {similar.map(m => <MediaCard key={m.id} item={m} mediaType="movie" />)}
            {!similar.length && <p style={{ color: 'var(--text-muted)' }}>No similar movies found.</p>}
          </div>
        )}

        {activeTab === 'recommended' && (
          <div className="media-grid">
            {recommended.map(m => <MediaCard key={m.id} item={m} mediaType="movie" />)}
            {!recommended.length && <p style={{ color: 'var(--text-muted)' }}>No recommendations found.</p>}
          </div>
        )}
      </div>

      {trailerKey && <TrailerModal videoKey={trailerKey} title={movie.title} onClose={() => setTrailerKey(null)} />}
      {streamUrl && <StreamModal embedUrl={streamUrl} title={movie.title} onClose={() => setStreamUrl(null)} />}
      <div style={{ height: 80 }} />
    </div>
  );
}
