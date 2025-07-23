import React, { useState, useEffect } from "react";
import * as collectionService from "../services/collectionService";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";

const ArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const { data } = await collectionService.fetchArtists();
        setArtists(data);
      } catch (err) {
        setError("Failed to fetch artists. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
    } };
    fetchArtists();
  }, []);

  return (
    <div className="library-page">
      <div className="carousel__header">
        <h1 className="carousel__title">Selected Artists</h1>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="playlists-grid">
          {artists.map((artist) => (
            <div key={artist._id} className="playlist-card-container">
              <Card item={artist} type="artist" />
            </div>
          ))}
        </div>
      )}
    </div>
); };

export default ArtistsPage;