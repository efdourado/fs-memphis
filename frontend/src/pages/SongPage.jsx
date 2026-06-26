import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPause, faPlay, faShareNodes } from "@fortawesome/free-solid-svg-icons";

import { fetchSongById, shareSong } from "../services/collectionService";
import { toggleLikeSong } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../hooks/usePlayer";
import { formatDuration } from "../utils/duration";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import fallbackImage from "/fb.jpg";

const SongPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = usePlayer();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadSong = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await fetchSongById(id);
        if (!cancelled) setSong(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Could not load song.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadSong();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const isCurrent = currentTrack?._id === song?._id;
  const coverImage = song?.coverImage || song?.album?.coverImage || fallbackImage;
  const duration = useMemo(() => {
    if (!song?.durationMs) return "";
    return formatDuration(song.durationMs / 1000);
  }, [song]);

  const handlePlay = useCallback(() => {
    if (!song?.audioUrl) return;
    if (isCurrent) {
      togglePlayPause();
      return;
    }
    playTrack(song, { type: "library", id: song._id, label: "song page" });
  }, [isCurrent, playTrack, song, togglePlayPause]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setFeedback("Sign in to like songs.");
      return;
    }
    const { data } = await toggleLikeSong(song._id);
    setFeedback(data.liked ? "Added to liked songs." : "Removed from liked songs.");
  };

  const handleShare = async () => {
    const { data } = await shareSong(song._id);
    const shareUrl = data.shareUrl?.startsWith("http")
      ? data.shareUrl
      : `${window.location.origin}${data.shareUrl || `/song/${song._id}`}`;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
    }
    setFeedback("Share link copied.");
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} />;
  if (!song) return null;

  return (
    <main className="song-page">
      <section className="song-page__hero">
        <div className="song-page__art">
          <img src={coverImage} alt={song.title} onError={(event) => { event.currentTarget.src = fallbackImage; }} />
        </div>
        <div className="song-page__body">
          <p className="song-page__eyebrow">{song.album?.title || "Single"}</p>
          <h1 className="song-page__title">{song.title}</h1>
          {song.subtitle && <p className="song-page__subtitle">{song.subtitle}</p>}
          <p className="song-page__artist">
            {song.artist?._id ? (
              <Link to={`/artist/${song.artist._id}`}>{song.artist.name}</Link>
            ) : song.artist?.name}
            {duration && <span>{duration}</span>}
          </p>

          <div className="song-page__actions">
            <button className="action-btn play" onClick={handlePlay} disabled={!song.audioUrl}>
              <FontAwesomeIcon icon={isCurrent && isPlaying ? faPause : faPlay} />
            </button>
            <button className="action-btn menu" onClick={handleLike}>
              <FontAwesomeIcon icon={faHeart} />
            </button>
            <button className="action-btn menu" onClick={handleShare}>
              <FontAwesomeIcon icon={faShareNodes} />
            </button>
          </div>

          {feedback && <p className="song-page__feedback">{feedback}</p>}
        </div>
      </section>

      <section className="song-page__details">
        {song.description && <p className="song-page__description">{song.description}</p>}
        {((song.genres?.length || song.genre?.length) || song.emotions?.length || song.instruments?.length) && (
          <div className="song-page__tags">
            {[...(song.genres?.length ? song.genres : song.genre || []), ...(song.emotions || []), ...(song.instruments || [])].slice(0, 12).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
        {(song.education?.theoryNotes || song.editorial?.productionNotes) && (
          <div className="song-page__notes">
            {song.education?.theoryNotes && <p>{song.education.theoryNotes}</p>}
            {song.editorial?.productionNotes && <p>{song.editorial.productionNotes}</p>}
          </div>
        )}
      </section>
    </main>
  );
};

export default SongPage;
