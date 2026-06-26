import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faHeart, faPlus, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import ErrorMessage from "../ui/ErrorMessage";
import Modal from "../ui/Modal";
import LoadingSpinner from "../ui/LoadingSpinner";
import List from "../ui/List";
import { useSongModal } from "../../context/SongModalContext";
import { useAuth } from "../../context/AuthContext";
import { shareSong } from "../../services/collectionService";
import {
  getMyPlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist,
  createPlaylist,
  toggleLikeSong,
} from "../../services/userService";

const CreatePlaylistView = ({ song, onPlaylistCreated, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Playlist name is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data: newPlaylistData } = await createPlaylist({ name, description });
      await addSongToPlaylist(newPlaylistData._id, song._id);
      onPlaylistCreated(newPlaylistData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create playlist");
    } finally {
      setLoading(false);
  } };

  return (
    <form onSubmit={handleSubmit} className="form-container" style={{ gap: 'var(--spacing-lg)'}}>
      {error && <ErrorMessage message={error} />}

      <div className="form-group">
        <label htmlFor="playlist-name">Name</label>
        <input
          id="playlist-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="playlist-description">Description (Optional)</label>
        <textarea
          id="playlist-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          disabled={loading}
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading} className="login-btn">
          {loading ? "Creating..." : `Create & Add`}
        </button>
      </div>
    </form>
); };


const SongModal = () => {
  const { isMenuOpen, song, closeMenu, menuContext } = useSongModal();
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState("list");
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ message: "", isError: false });

  const fetchPlaylists = () => {
    if (isMenuOpen && view === "list") {
      setLoading(true);
      setFeedback({ message: "", isError: false });
      getMyPlaylists()
        .then((response) => setPlaylists(response.data))
        .catch(() => setFeedback({ message: "Could not load your playlists", isError: true }))
        .finally(() => setLoading(false));
  } };

  useEffect(() => {
    fetchPlaylists();
  }, [isMenuOpen, view]);

  useEffect(() => {
    if (isMenuOpen) {
      setView("list");
      setFeedback({ message: "", isError: false });
    }
  }, [isMenuOpen, song]);

  const isSongInPlaylist = (playlist) => {
    if (!playlist.songs || !song?._id) return false;
    return playlist.songs.some(s => s.song?._id === song._id);
  };

  const handlePlaylistClick = async (playlist) => {
    const isAdded = isSongInPlaylist(playlist);
    try {
      if (isAdded) {
        await removeSongFromPlaylist(playlist._id, song._id);
        setFeedback({ message: `Removed from "${playlist.name}"!` });
      } else {
        await addSongToPlaylist(playlist._id, song._id);
        setFeedback({ message: `Added to "${playlist.name}"!` });
      }
      fetchPlaylists();
      setTimeout(() => setFeedback({ message: "", isError: false }), 1500);

    } catch (err) {
      const message = err.response?.data?.message || `Failed to ${isAdded ? 'remove' : 'add'} song`;
      setFeedback({ message, isError: true });
  } };

  const handlePlaylistCreated = (newPlaylist) => {
    setFeedback({ message: `Added to "${newPlaylist.name}"!` });
    setTimeout(closeMenu, 1500);
  };

  const handleLikeSong = async () => {
    if (!isAuthenticated) {
      setFeedback({ message: "Sign in to like songs.", isError: true });
      setTimeout(() => setFeedback({ message: "", isError: false }), 1800);
      return;
    }

    try {
      const { data } = await toggleLikeSong(song._id);
      setFeedback({ message: data.liked ? "Added to liked songs." : "Removed from liked songs." });
      setTimeout(() => setFeedback({ message: "", isError: false }), 1500);
    } catch (err) {
      setFeedback({ message: err.response?.data?.message || "Could not update liked songs.", isError: true });
    }
  };

  const handleShareSong = async () => {
    try {
      const { data } = await shareSong(song._id);
      const shareUrl = data.shareUrl?.startsWith("http")
        ? data.shareUrl
        : `${window.location.origin}${data.shareUrl || `/song/${song._id}`}`;

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      }

      setFeedback({ message: "Share link copied." });
      setTimeout(() => setFeedback({ message: "", isError: false }), 1500);
    } catch (err) {
      setFeedback({ message: err.response?.data?.message || "Could not create share link.", isError: true });
    }
  };
  
  const renderFeedback = () => (
    <div
      className="add-to-playlist-feedback"
      style={{ color: feedback.isError ? "var(--color-error)" : "var(--color-success)" }}
    >
      {!feedback.isError && <FontAwesomeIcon icon={faCheckCircle} />}
      <p>{feedback.message}</p>
    </div>
  );

  const renderListView = () => (
    <>
      <div className="static-options song-modal-actions">
        <button onClick={handleLikeSong} className="login-btn create-btn">
          <FontAwesomeIcon icon={faHeart} />
          <span>Like song</span>
        </button>
        <button onClick={handleShareSong} className="login-btn create-btn">
          <FontAwesomeIcon icon={faShareNodes} />
          <span>Share song</span>
        </button>
        <button onClick={() => setView("create")} className="login-btn create-btn">
          <FontAwesomeIcon icon={faPlus} />
          <span>New playlist</span>
        </button>
      </div>

      <div className="playlist-selection-list">
        <List 
          items={playlists}
          type="playlist"
          onItemClick={(playlist) => handlePlaylistClick(playlist)}
          checkAdded={isSongInPlaylist}
          showHeader={false}
          displayAll={true}
        />
      </div>
    </>
  );

  if (!isMenuOpen || !song) {
    return null;
  }

  const getTitle = () => {
    if (feedback.message) return "";
    if (view === 'create') return "Create Playlist & Add Song";
    return `Add '${song.title}' to...`;
  }

  return (
    <Modal isOpen={isMenuOpen} onClose={closeMenu} title={getTitle()}>
      {feedback.message ? renderFeedback() : null}
      {!feedback.message && loading ? <LoadingSpinner fullScreen={false} /> : null}
      {!feedback.message && !loading && view === "list" ? renderListView() : null}
      {!feedback.message && !loading && view === "create" ? (
        <CreatePlaylistView
          song={song}
          onPlaylistCreated={handlePlaylistCreated}
          onCancel={() => setView("list")}
        />
      ) : null}
    </Modal>
); };

export default SongModal;
