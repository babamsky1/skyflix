import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTVDetail, fetchTVVideos, fetchTVStream, fetchTVEpisodes, getImageUrl, getBackdropUrl } from '../utils/api';
import TrailerModal from '../components/TrailerModal';
import StreamModal from '../components/StreamModal';
import MediaCard from '../components/MediaCard';

const SECTION_HEADER = { fontWeight: 700, fontSize: 18, marginBottom: 16, letterSpacing: '-0.3px' };
const TITLE_STYLE = { fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 8, lineHeight: 1.1 };

export default function TVDetail() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [episodes, setEpisodes] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [currentProvider, setCurrentProvider] = useState('vidsrc');
  const [expandedOverview, setExpandedOverview] = useState(false);

  const handleWatchNow = async () => {
    try {
      const res = await fetchTVStream(id, currentProvider, 1, 1);
      setStreamUrl(res.data.embed_url);
    } catch (err) {
      console.error('Failed to get stream URL:', err);
      alert('Failed to load stream. Please try another provider.');
    }
  };

  const handleProviderChange = async (newProvider) => {
    setCurrentProvider(newProvider);
    try {
      const res = await fetchTVStream(id, newProvider, 1, 1);
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
    if (show) {
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
  }, [id, selectedSeason, show]);

  if (loading) return <div style={{ paddingTop: 70 }}><div className="loading-center"><div className="spinner" /></div></div>;
  if (!show) return <div style={{ paddingTop: 120, textAlign: 'center' }}>Show not found.</div>;

  const trailer = videos.find(v => v.type === 'Trailer') || videos[0];
  const rating = show.vote_average?.toFixed(1);
  const ratingColor = rating >= 7.5 ? '#06d6a0' : rating >= 6 ? '#ffd60a' : '#e63946';
  const similar = show.similar?.results?.slice(0, 12) || [];
  const recommended = show.recommendations?.results?.slice(0, 12) || [];
  const cast = show.credits?.cast?.slice(0, 10) || [];
  const overviewText = show.overview || 'No overview available.';
  const isLongOverview = overviewText.length > 300;

  return (
    <div style={{ paddingTop: 70 }}>
      {/* Subtle backdrop banner */}
      <div style={{
        position: 'relative', height: 280, overflow: 'hidden',
        background: 'var(--bg-card)',
      }}>
        {getBackdropUrl(show.backdrop_path) ? (
          <img src={getBackdropUrl(show.backdrop_path)} alt={show.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4) saturate(1.2)', opacity: 0.6 }} />
        ) : null}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, var(--bg) 100%)' }} />
      </div>

      <div className="container" style={{ marginTop: -160, position: 'relative', zIndex: 1 }}>
        {/* Hero section */}
        <div className="detail-hero">
          <div className="detail-poster">
            {getImageUrl(show.poster_path) ? (
              <img src={getImageUrl(show.poster_path)} alt={show.name} />
            ) : (
              <div className="detail-poster-fallback">📺</div>
            )}
          </div>

          <div className="detail-info">
            <div className="detail-badges">
              <span className="badge badge-tv">📺 TV Show</span>
              {show.genres?.map(g => (
                <span key={g.id} className="detail-genre-tag">{g.name}</span>
              ))}
            </div>

            <h1 style={TITLE_STYLE}>{show.name}</h1>

            {show.tagline && <p className="detail-tagline">"{show.tagline}"</p>}

            <div className="detail-meta">
              <div className="detail-rating" style={{ color: ratingColor }}>
                <span className="detail-star">★</span>
                <div>
                  <div className="detail-rating-value">{rating}</div>
                  <div className="detail-rating-label">{show.vote_count?.toLocaleString()} votes</div>
                </div>
              </div>
              {show.first_air_date && (
                <div className="detail-meta-item">
                  <span className="detail-meta-label">First Aired</span>
                  <span>{new Date(show.first_air_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
              {show.number_of_seasons && (
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Seasons</span>
                  <span>{show.number_of_seasons}</span>
                </div>
              )}
              {show.number_of_episodes && (
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Episodes</span>
                  <span>{show.number_of_episodes}</span>
                </div>
              )}
              {show.status && (
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Status</span>
                  <span style={{ color: show.status === 'Returning Series' ? 'var(--green)' : 'inherit' }}>{show.status}</span>
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
            </div>
          </div>
        </div>

        {/* Content sections */}
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
            {show.networks?.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div className="detail-meta-label" style={{ marginBottom: 8, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1 }}>Networks</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {show.networks.map(n => (
                    <div key={n.id} className="detail-network-tag">{n.name}</div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Episodes */}
          <section className="detail-section">
            <h3 style={SECTION_HEADER}>Episodes</h3>
            {show.number_of_seasons && (
              <div className="detail-season-tabs">
                {Array.from({ length: show.number_of_seasons }, (_, i) => i + 1).map(season => (
                  <button
                    key={season}
                    onClick={() => setSelectedSeason(season)}
                    className={`detail-season-btn ${selectedSeason === season ? 'active' : ''}`}
                  >
                    S{season}
                  </button>
                ))}
              </div>
            )}
            {episodes?.episodes ? (
              <div className="detail-episodes-list">
                {episodes.episodes.map(episode => (
                  <div
                    key={episode.id}
                    className="detail-episode-card"
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
                      <img src={getImageUrl(episode.still_path, 'w300')} alt={episode.name} className="detail-episode-still" />
                    ) : (
                      <div className="detail-episode-still detail-episode-still-fallback">📺</div>
                    )}
                    <div className="detail-episode-info">
                      <div className="detail-episode-header">
                        <span className="detail-episode-code">S{selectedSeason} E{episode.episode_number}</span>
                        {episode.vote_average && (
                          <span className="detail-episode-rating">★ {episode.vote_average.toFixed(1)}</span>
                        )}
                      </div>
                      <h4 className="detail-episode-name">{episode.name}</h4>
                      <p className="detail-episode-overview">{episode.overview || 'No overview available.'}</p>
                      {episode.air_date && (
                        <div className="detail-episode-date">
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
              <h3 style={SECTION_HEADER}>Similar Shows</h3>
              <div className="media-grid">
                {similar.map(s => <MediaCard key={s.id} item={s} mediaType="tv" />)}
              </div>
            </section>
          )}

          {/* Recommended */}
          {recommended.length > 0 && (
            <section className="detail-section">
              <h3 style={SECTION_HEADER}>You Might Also Like</h3>
              <div className="media-grid">
                {recommended.map(s => <MediaCard key={s.id} item={s} mediaType="tv" />)}
              </div>
            </section>
          )}
        </div>
      </div>

      {trailerKey && <TrailerModal videoKey={trailerKey} title={show.name} onClose={() => setTrailerKey(null)} />}
      {streamUrl && <StreamModal embedUrl={streamUrl} title={show.name} onClose={() => setStreamUrl(null)} onProviderChange={handleProviderChange} currentProvider={currentProvider} mediaType="tv" mediaId={id} />}
      <div style={{ height: 80 }} />
    </div>
  );
}
