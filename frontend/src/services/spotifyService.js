import apiClient from "./apiClient";

export const getSpotifyStatus = () => apiClient.get("/spotify/status");

export const searchSpotifyTracks = (query, params = {}) => apiClient.get("/spotify/search", {
  params: {
    q: query,
    ...params,
  },
});
