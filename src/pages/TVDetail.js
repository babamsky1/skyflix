import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTVDetail, fetchTVVideos, fetchTVStream, fetchTVEpisodes, getImageUrl, getBackdropUrl } from '../utils/api';
import TrailerModal from '../components/TrailerModal';
import StreamModal from '../components/StreamModal';
import MediaCard from '../components/MediaCard';

export default function TVDetail() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [streamUrl, setStreamUrl] = useState(null);
  const [episodes, setEpisodes] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);

  const handleWatchNow = async () => {
    try {
      const res = await fetchTVStream(id, 'vidsrc', 1, 1);
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
        const [sRes, vRes] = await Promise.all([fetchTVDetail(id), fetchTVVideos(id)]);
        setShow(sRes.data);
        setVideos(vRes.data.results || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (show && activeTab === 'episodes') {
      const loadEpisodes = async () => {
        try {
          const res = await fetchTVEpisodes(id, selectedSeason);
          setEpisodes(res.data);
        } catch (err) {
          console.error('Failed to load episodes:', err);
        }
      };
      loadEpisodes();
    }
  }, [id, selectedSeason, activeTab, show]);

  if (loading) return <div style={{ paddingTop: 70 }}><div className="loading-center"><div className="spinner" /></div></div>;
  if (!show) return <div style={{ paddingTop: 120, textAlign: 'center' }}>Show not found.</div>;

  const trailer = videos.find(v => v.type === 'Trailer') || videos[0];
  const rating = show.vote_average?.toFixed(1);
  const ratingColor = rating >= 7.5 ? '#06d6a0' : rating >= 6 ? '#ffd60a' : '#e63946';
  const similar = show.similar?.results?.slice(0, 12) || [];
  const recommended = show.recommendations?.results?.slice(0, 12) || [];
  const cast = show.credits?.cast?.slice(0, 10) || [];

  return (
    <div style={{ paddingTop: 70 }}>
      <div style={{ position: 'relative', height: 'min(500px, 70vh)', overflow: 'hidden' }}>
        {getBackdropUrl(show.backdrop_path) ? (
          <img src={getBackdropUrl(show.backdrop_path)} alt={show.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : <div style={{ width: '100%', height: '100%', background: 'var(--surface)' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, var(--bg) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,15,0.8) 0%, transparent 60%)' }} />
      </div>

      <div className="container" style={{ marginTop: -200, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flexShrink: 0, width: 240, borderRadius: 14, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', border: '1px solid var(--border)' }}>
            {getImageUrl(show.poster_path) ? (
              <img src={getImageUrl(show.poster_path)} alt={show.name} style={{ width: '100%', display: 'block' }} />
            ) : (
              <div style={{ width: 240, height: 360, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>📺</div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="badge badge-tv">📺 TV Show</span>
              {show.genres?.map(g => (
                <span key={g.id} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{g.name}</span>
              ))}
            </div>

            <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(32px, 5vw, 60px)', letterSpacing: 2, marginBottom: 8, lineHeight: 0.95 }}>{show.name}</h1>
            {show.tagline && <p style={{ fontSize: 16, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 16 }}>"{show.tagline}"</p>}

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 22, color: ratingColor }}>⭐</span>
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700, color: ratingColor }}>{rating}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{show.vote_count?.toLocaleString()} votes</div>
                </div>
              </div>
              {show.first_air_date && <div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>First Aired</div><div style={{ fontWeight: 600 }}>{new Date(show.first_air_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div></div>}
              {show.number_of_seasons && <div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Seasons</div><div style={{ fontWeight: 600 }}>{show.number_of_seasons}</div></div>}
              {show.number_of_episodes && <div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Episodes</div><div style={{ fontWeight: 600 }}>{show.number_of_episodes}</div></div>}
              {show.status && <div><div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Status</div><div style={{ fontWeight: 600, color: show.status === 'Returning Series' ? 'var(--green)' : 'inherit' }}>{show.status}</div></div>}
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
                  boxShadow: '0 4px 20px var(--accent-glow)',
                }}>▶ Watch Trailer</button>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 40, borderBottom: '1px solid var(--border)', marginBottom: 32, display: 'flex', gap: 4, overflowX: 'auto' }}>
          {['overview', 'episodes', 'cast', 'videos', 'similar', 'recommended'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === t ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === t ? 'var(--accent)' : 'transparent'}`,
              fontWeight: 600, fontSize: 14, textTransform: 'capitalize', marginBottom: -1, whiteSpace: 'nowrap',
            }}>{t}</button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div style={{ maxWidth: 800 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 18 }}>Overview</h3>
            <p style={{ lineHeight: 1.8, color: 'var(--text-muted)', fontSize: 15 }}>{show.overview || 'No overview available.'}</p>
            {show.networks?.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>NETWORKS</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {show.networks.map(n => (
                    <div key={n.id} style={{ padding: '8px 16px', background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, fontWeight: 600 }}>{n.name}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

{activeTab === 'episodes' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 18 }}>Episodes</h3>
              {show.number_of_seasons && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                  {Array.from({ length: show.number_of_seasons }, (_, i) => i + 1).map(season => (
                    <button
                      key={season}
                      onClick={() => setSelectedSeason(season)}
                      style={{
                        padding: '8px 16px',
                        background: selectedSeason === season ? 'var(--accent)' : 'var(--bg-elevated)',
                        color: selectedSeason === season ? '#fff' : 'var(--text)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      Season {season}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {episodes?.episodes ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {episodes.episodes.map(episode => (
                  <div
                    key={episode.id}
                    style={{
                      display: 'flex',
                      gap: 16,
                      padding: 16,
                      background: 'var(--bg-card)',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                    }}
                    onClick={async () => {
                      try {
                        const res = await fetchTVStream(id, 'vidsrc', selectedSeason, episode.episode_number);
                        setStreamUrl(res.data.embed_url);
                      } catch (err) {
                        console.error('Failed to get stream URL:', err);
                        alert('Failed to load stream. Please try another provider.');
                      }
                    }}
                  >
                    {episode.still_path ? (
                      <img
                        src={getImageUrl(episode.still_path, 'w300')}
                        alt={episode.name}
                        style={{ width: 180, height: 100, objectFit: 'cover', borderRadius: 8 }}
                      />
                    ) : (
                      <div style={{ width: 180, height: 100, background: 'var(--surface)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📺</div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>
                          S{selectedSeason} E{episode.episode_number}
                        </span>
                        {episode.vote_average && (
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>⭐ {episode.vote_average.toFixed(1)}</span>
                        )}
                      </div>
                      <h4 style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{episode.name}</h4>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {episode.overview || 'No overview available.'}
                      </p>
                      {episode.air_date && (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                          {new Date(episode.air_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Loading episodes...</p>
            )}
          </div>
        )}

        {activeTab === 'cast' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16 }}>
            {cast.map(c => (
              <div key={c.id} style={{ textAlign: 'center', background: 'var(--bg-card)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                {getImageUrl(c.profile_path, 'w185') ? (
                  <img src={getImageUrl(c.profile_path, 'w185')} alt={c.name} style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }} />
                ) : <div style={{ width: '100%', aspectRatio: '2/3', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>👤</div>}
                <div style={{ padding: '10px 8px' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.character}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'videos' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {videos.map(v => (
              <div key={v.key} onClick={() => setTrailerKey(v.key)} style={{ borderRadius: 10, overflow: 'hidden', cursor: 'pointer', position: 'relative', border: '1px solid var(--border)', background: 'var(--bg-card)' }}
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
            {similar.map(s => <MediaCard key={s.id} item={s} mediaType="tv" />)}
            {!similar.length && <p style={{ color: 'var(--text-muted)' }}>No similar shows found.</p>}
          </div>
        )}

        {activeTab === 'recommended' && (
          <div className="media-grid">
            {recommended.map(s => <MediaCard key={s.id} item={s} mediaType="tv" />)}
            {!recommended.length && <p style={{ color: 'var(--text-muted)' }}>No recommendations found.</p>}
          </div>
        )}
      </div>

      {trailerKey && <TrailerModal videoKey={trailerKey} title={show.name} onClose={() => setTrailerKey(null)} />}
      {streamUrl && <StreamModal embedUrl={streamUrl} title={show.name} onClose={() => setStreamUrl(null)} />}
      <div style={{ height: 80 }} />
    </div>
  );
}
