import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones, faCheckCircle, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import ErrorMessage from "../ui/ErrorMessage";
import Modal from "../ui/Modal";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useSongModal } from "../../context/SongModalContext";
import { getMyPlaylists, addSongToPlaylist, createPlaylist } from "../../services/userService";

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
          placeholder="My Awesome Playlist"
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

      <div className="form-actions" style={{ paddingTop: '0', marginTop: '0' }}>
        <button type="button" onClick={onCancel} className="cta-button cancel" disabled={loading}>
          Cancel
        </button>
        <button type="submit" disabled={loading} className="cta-button secondary-cta">
          {loading ? "Creating..." : `Create & Add`}
        </button>
      </div>
    </form>
); };


const SongModal = () => {
  const { isMenuOpen, song, closeMenu, menuContext } = useSongModal();
  const [view, setView] = useState("list");
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ message: "", isError: false });

  useEffect(() => {
    if (isMenuOpen && view === "list") {
      setLoading(true);
      setFeedback({ message: "", isError: false });
      getMyPlaylists()
        .then((response) => setPlaylists(response.data))
        .catch(() => setFeedback({ message: "Could not load your playlists", isError: true }))
        .finally(() => setLoading(false));
    }
  }, [isMenuOpen, view]);

  useEffect(() => {
    if (isMenuOpen) {
      setView("list");
      setFeedback({ message: "", isError: false });
    }
  }, [isMenuOpen, song]);

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await addSongToPlaylist(playlistId, song._id);
      const playlist = playlists.find((p) => p._id === playlistId);
      setFeedback({ message: `Added to "${playlist.name}"!` });
      setTimeout(closeMenu, 1500);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add song";
      setFeedback({ message, isError: true });
  } };

  const handlePlaylistCreated = (newPlaylist) => {
    setFeedback({ message: `Added to "${newPlaylist.name}"!` });
    setTimeout(closeMenu, 1500);
  };

  const handleRemoveClick = () => {
    if (menuContext?.onRemove) {
      menuContext.onRemove();
      setFeedback({ message: "Song removed!" });
      setTimeout(closeMenu, 1500);
  } };
  
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
    <ul className="playlist-selection-list">
      {menuContext?.source === "playlist" && (
        <li>
          <button onClick={handleRemoveClick} className="delete-option">
            <FontAwesomeIcon icon={faTrashCan} className="playlist-icon" />
            <span>Remove from this Playlist</span>
          </button>
        </li>
      )}
      <li>
        <button onClick={() => setView("create")}>
          <FontAwesomeIcon icon={faPlus} className="playlist-icon" />
          <span>Add to new playlist</span>
        </button>
      </li>
      {playlists.map((playlist) => (
        <li key={playlist._id}>
          <button onClick={() => handleAddToPlaylist(playlist._id)}>
            <FontAwesomeIcon icon={faHeadphones} className="playlist-icon" />
            <span>{playlist.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );

  if (!isMenuOpen || !song) {
    return null;
  }

  const getTitle = () => {
    if (feedback.message) return "";
    if (view === 'create') return "Create & Add Song";
    return song.title;
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