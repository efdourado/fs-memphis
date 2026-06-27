import apiClient from './apiClient';

export const fetchArtists = () => apiClient.get('/artists'); 
export const fetchArtistById = (id) => apiClient.get(`/artist/${id}`); 

export const fetchSongs = () => apiClient.get('/songs');
export const fetchSongById = (id) => apiClient.get(`/song/${id}`);
export const fetchRecommendations = (params = {}) => apiClient.get('/recommendations', { params });
export const fetchShuffleQueue = (params = {}) => apiClient.get('/shuffle/songs', { params });
export const shareSong = (id) => apiClient.post(`/song/${id}/share`);

export const fetchAlbums = () => apiClient.get('/albums');
export const fetchAlbumById = (id) => apiClient.get(`/album/${id}`);

export const fetchPlaylists = () => apiClient.get('/playlists');
export const fetchPlaylistById = (id) => apiClient.get(`/playlist/${id}`);

export const fetchPosts = () => apiClient.get('/posts');
export const fetchPostBySlug = (slug) => apiClient.get(`/post/${slug}`);
