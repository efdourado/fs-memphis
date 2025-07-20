import apiClient from './apiClient';

export const createArtist = (formData) => apiClient.post('/artists', formData);
export const updateArtist = (id, formData) => apiClient.put(`/artist/${id}`, formData);
export const deleteArtist = (id) => apiClient.delete(`/artist/${id}`);

export const createSong = (formData) => apiClient.post('/songs', formData);
export const updateSong = (id, formData) => apiClient.put(`/song/${id}`, formData);
export const deleteSong = (id) => apiClient.delete(`/song/${id}`);

export const createAlbum = (formData) => apiClient.post('/albums', formData);
export const updateAlbum = (id, formData) => apiClient.put(`/album/${id}`, formData);
export const deleteAlbum = (id) => apiClient.delete(`/album/${id}`);

export const fetchUsers = () => apiClient.get('/users');
export const deleteUser = (id) => apiClient.delete(`/user/${id}`);

export const createUser = (formData) => apiClient.post('/users', formData);