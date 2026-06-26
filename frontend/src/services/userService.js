import apiClient from './apiClient';

export const getMyPlaylists = () => apiClient.get('/me/playlists');
export const getMyLikedSongs = () => apiClient.get('/me/liked-songs');
export const getMyMusicProfile = () => apiClient.get('/me/music-profile');
export const createPlaylist = (playlistData) => apiClient.post('/playlists', playlistData);
export const updatePlaylist = (id, playlistData) => apiClient.put(`/playlist/${id}`, playlistData);
export const deletePlaylist = (id) => apiClient.delete(`/playlist/${id}`);
export const addSongToPlaylist = (playlistId, songId) => apiClient.post(`/playlist/${playlistId}/song/${songId}`);
export const removeSongFromPlaylist = (playlistId, songId) => apiClient.delete(`/playlist/${playlistId}/song/${songId}`);
export const toggleLikeSong = (songId) => apiClient.post(`/song/${songId}/like`);
export const followArtist = (artistId) => apiClient.post(`/artist/${artistId}/follow`);
export const unfollowArtist = (artistId) => apiClient.delete(`/artist/${artistId}/follow`);

export const fetchUserById = (id) => apiClient.get(`/user/${id}`);
export const updateUser = (id, userData) => apiClient.put(`/user/${id}`, userData);
