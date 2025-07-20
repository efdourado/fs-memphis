import { useState, useEffect } from "react";
import {
  fetchArtists,
  fetchSongs,
  fetchAlbums,
  fetchPlaylists,
} from "../services/collectionService.js";

export const useHomePageData = () => {
  const [data, setData] = useState({
    songs: [],
    artists: [],
    albums: [],
    playlists: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          { data: songsData },
          { data: artistsData },
          { data: albumsData },
          { data: playlistsData },
        ] = await Promise.all([
          fetchSongs(),
          fetchArtists(),
          fetchAlbums(),
          fetchPlaylists(),
        ]);

        setData({
          songs: songsData || [],
          artists: artistsData || [],
          albums: albumsData || [],
          playlists: playlistsData || [],
        });
      } catch (err) {
        console.error("Error loading homepage data:", err);
        setError("Could not load music. Please try again later.");
      } finally {
        setLoading(false);
    } };

    loadData();
  }, []);

  return { ...data, loading, error };
};