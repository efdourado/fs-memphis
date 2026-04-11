import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getMyLikedSongs } from "../../services/userService";
import List from "../../components/ui/List";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

const LibrarySongsPage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await getMyLikedSongs();
        if (!cancelled) {
          setSongs(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load liked songs.");
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

  if (songs.length === 0) {
    return (
      <section className="library-section library-empty" aria-labelledby="library-songs-heading">
        <h2 id="library-songs-heading" className="library-section__heading">
          Liked songs
        </h2>
        <p className="library-empty__text">
          You have not liked any tracks yet. Explore the app and save songs you love.
        </p>
        <Link to="/" className="login-btn always-hover">
          Go to home
        </Link>
      </section>
    );
  }

  return (
    <section className="library-section" aria-labelledby="library-songs-heading">
      <h2 id="library-songs-heading" className="library-section__heading">
        Liked songs
      </h2>
      <List
        items={songs}
        type="song"
        showHeader={false}
        showImage
        showAlbum
        showDuration
        displayAll
      />
    </section>
  );
};

export default LibrarySongsPage;
