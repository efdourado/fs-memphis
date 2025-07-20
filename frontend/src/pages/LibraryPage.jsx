import React, { useState, useEffect } from "react";

import { getMyPlaylists } from "../services/userService";

import Card from "../components/ui/Card";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const LibraryPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const { data } = await getMyPlaylists();
      setPlaylists(data);
    } catch (err) {
      setError("Failed to fetch your playlists. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
  } };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <div className="library-page">
      <div className="carousel__header">
        <h1 className="carousel__title">Your Library</h1>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="playlists-grid">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="playlist-card-container">
              <Card item={playlist} type="playlist" />
            </div>
          ))}
        </div>
      )}
    </div>
); };

export default LibraryPage;