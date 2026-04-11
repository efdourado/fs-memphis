import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { getMyPlaylists } from "../../services/userService";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import CreatePlaylistModal from "./CreatePlaylistModal";

const LibraryPlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  const fetchPlaylists = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getMyPlaylists();
      setPlaylists(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load your playlists.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleCreated = (playlist) => {
    fetchPlaylists();
    if (playlist?._id) {
      navigate(`/playlist/${playlist._id}`);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <section className="library-section" aria-labelledby="library-pl-heading">
      <div className="library-section__toolbar">
        <h2 id="library-pl-heading" className="library-section__heading">
          Your playlists
        </h2>
        <button
          type="button"
          className="login-btn always-hover library-section__cta"
          onClick={() => setCreateOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="btn-icon-graphic" />
          <span>New playlist</span>
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="library-empty">
          <p>You do not have any playlists yet.</p>
          <button type="button" className="login-btn always-hover" onClick={() => setCreateOpen(true)}>
            Create your first playlist
          </button>
        </div>
      ) : (
        <div className="playlists-grid">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="playlist-card-container">
              <Card item={playlist} type="playlist" />
            </div>
          ))}
        </div>
      )}

      <CreatePlaylistModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />
    </section>
  );
};

export default LibraryPlaylistsPage;
