import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
export const IMG_BASE = process.env.REACT_APP_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

const api = axios.create({ baseURL: API_BASE, timeout: 30000 });

export const getImageUrl = (path, size = 'w500') => path ? `${IMG_BASE}/${size}${path}` : null;
export const getBackdropUrl = (path) => path ? `${IMG_BASE}/original${path}` : null;

export const fetchTrendingMovies = (page = 1) => api.get(`/movies/trending/?page=${page}`);
export const fetchPopularMovies = (page = 1) => api.get(`/movies/popular/?page=${page}`);
export const fetchTopRatedMovies = (page = 1) => api.get(`/movies/top-rated/?page=${page}`);
export const fetchMovieDetail = (id) => api.get(`/movies/${id}/`);
export const fetchMovieVideos = (id) => api.get(`/movies/${id}/videos/`);
export const fetchSimilarMovies = (id) => api.get(`/movies/${id}/similar/`);
export const fetchMovieRecommendations = (id) => api.get(`/movies/${id}/recommendations/`);

export const fetchPopularTV = (page = 1) => api.get(`/tv/?page=${page}`);
export const fetchTrendingTV = (page = 1) => api.get(`/tv/trending/?page=${page}`);
export const fetchTopRatedTV = (page = 1) => api.get(`/tv/top-rated/?page=${page}`);
export const fetchTVDetail = (id) => api.get(`/tv/${id}/`);
export const fetchTVVideos = (id) => api.get(`/tv/${id}/videos/`);
export const fetchTVEpisodes = (id, season = 1) => api.get(`/tv/${id}/episodes/?season=${season}`);
export const fetchSimilarTV = (id) => api.get(`/tv/${id}/similar/`);

export const fetchMovieGenres = () => api.get('/genres/movies/');
export const fetchTVGenres = () => api.get('/genres/tv/');
export const searchContent = (query, page = 1, type = 'multi') =>
  api.get(`/search/?query=${encodeURIComponent(query)}&page=${page}&type=${type}`);
export const discoverMovies = (params = {}) => api.get(`/discover/movies/?${new URLSearchParams(params)}`);
export const discoverTV = (params = {}) => api.get(`/discover/tv/?${new URLSearchParams(params)}`);

export const fetchMovieStream = (id, provider = 'vidsrc') => 
  api.get(`/movies/${id}/stream/?provider=${provider}`);
export const fetchTVStream = (id, provider = 'vidsrc', season = 1, episode = 1) => 
  api.get(`/tv/${id}/stream/?provider=${provider}&season=${season}&episode=${episode}`);

export default api;
