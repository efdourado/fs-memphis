import apiClient from './apiClient';

export const search = (query) => {
  return apiClient.get(`/search?q=${encodeURIComponent(query)}`);
};