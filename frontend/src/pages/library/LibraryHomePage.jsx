import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc, faHeart } from "@fortawesome/free-solid-svg-icons";

import { getMyPlaylists, getMyLikedSongs } from "../../services/userService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

const LibraryHomePage = () => {
  const [playlistCount, setPlaylistCount] = useState(0);
  const [likedCount, setLikedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [plRes, songsRes] = await Promise.all([
          getMyPlaylists(),
          getMyLikedSongs(),
        ]);
        if (!cancelled) {
          setPlaylistCount(Array.isArray(plRes.data) ? plRes.data.length : 0);
          setLikedCount(Array.isArray(songsRes.data) ? songsRes.data.length : 0);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Could not load your library summary.");
        }
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <section className="library-overview" aria-labelledby="library-overview-heading">
      <h2 id="library-overview-heading" className="sr-only">
        Library overview
      </h2>
      <div className="library-overview__grid">
        <Link to="/library/playlists" className="library-stat-card">
          <span className="library-stat-card__icon" aria-hidden>
            <FontAwesomeIcon icon={faCompactDisc} />
          </span>
          <div className="library-stat-card__text">
            <span className="library-stat-card__label">Playlists</span>
            <span className="library-stat-card__value">{playlistCount}</span>
            <span className="library-stat-card__hint">Manage and open your playlists</span>
          </div>
        </Link>
        <Link to="/library/songs" className="library-stat-card">
          <span className="library-stat-card__icon" aria-hidden>
            <FontAwesomeIcon icon={faHeart} />
          </span>
          <div className="library-stat-card__text">
            <span className="library-stat-card__label">Liked songs</span>
            <span className="library-stat-card__value">{likedCount}</span>
            <span className="library-stat-card__hint">Tracks you have saved</span>
          </div>
        </Link>
      </div>
      <p className="library-overview__footer-note">
        Tip: use the tabs above to jump straight to playlists or liked songs.
      </p>
    </section>
  );
};

export default LibraryHomePage;
