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

export const fetchPosts = () => apiClient.get('/posts');
export const createPost = (formData) => apiClient.post('/posts', formData);
export const updatePost = (slug, formData) => apiClient.put(`/post/${slug}`, formData);
export const deletePost = (slug) => apiClient.delete(`/post/${slug}`);

export const fetchTags = () => apiClient.get('/tags');
export const createTag = (formData) => apiClient.post('/tags', formData);

export const fetchPodcasts = () => apiClient.get('/podcasts');
export const createPodcast = (formData) => apiClient.post('/podcasts', formData);
export const updatePodcast = (id, formData) => apiClient.put(`/podcast/${id}`, formData);
export const deletePodcast = (id) => apiClient.delete(`/podcast/${id}`);