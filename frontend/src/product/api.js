import apiClient from '../services/apiClient';

const data = (request) => request.then((response) => response.data);

export const api = {
  works: () => data(apiClient.get('/works')),
  work: (slug) => data(apiClient.get(`/works/${encodeURIComponent(slug)}`)),
  person: (slug) => data(apiClient.get(`/people/${encodeURIComponent(slug)}`)),
  compare: (a, b) => data(apiClient.get('/compare', { params: { a, b } })),
  search: (q) => data(apiClient.get('/catalog/search', { params: { q } })),
  updates: () => data(apiClient.get('/updates')),
  library: () => data(apiClient.get('/me/library')),
  libraryState: () => data(apiClient.get('/me/library/state')),
  save: (slug) => data(apiClient.put(`/me/library/saved/${slug}`)),
  unsave: (slug) => data(apiClient.delete(`/me/library/saved/${slug}`)),
  follow: (slug) => data(apiClient.put(`/me/library/following/${slug}`)),
  unfollow: (slug) => data(apiClient.delete(`/me/library/following/${slug}`)),
  addQuestion: (workSlug, text) => data(apiClient.post('/me/library/questions', { workSlug, text })),
  removeQuestion: (id) => data(apiClient.delete(`/me/library/questions/${id}`)),
  markUpdatesSeen: () => data(apiClient.post('/me/updates/seen')),
  exportData: () => data(apiClient.get('/me/export')),
  deleteAccount: () => data(apiClient.delete('/me')),
};

export const errorMessage = (error, fallback = 'Something went wrong. Try again.') => (
  error?.response?.data?.message || error?.response?.data?.errors?.[0]?.msg || fallback
);
