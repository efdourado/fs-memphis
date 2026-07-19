import apiClient from './apiClient';

export const fetchSessions = () => apiClient.get('/sessions');
export const fetchSession = (id) => apiClient.get(`/session/${id}`);
export const createSession = (data) => apiClient.post('/sessions', data);
export const updateSession = (id, data) => apiClient.put(`/session/${id}`, data);
export const deleteSession = (id) => apiClient.delete(`/session/${id}`);
export const fetchReferences = () => apiClient.get('/me/references');
export const fetchInsights = () => apiClient.get('/me/listening-insights');
export const fetchAdminSessions = () => apiClient.get('/admin/listening-sessions');
