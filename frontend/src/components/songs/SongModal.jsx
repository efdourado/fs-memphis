import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones, faCheckCircle, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import ErrorMessage from "../ui/ErrorMessage";
import Modal from "../ui/Modal";
import LoadingSpinner from "../ui/LoadingSpinner";
import List from "../ui/List";
import { useSongModal } from "../../context/SongModalContext";
import { getMyPlaylists, addSongToPlaylist, removeSongFromPlaylist, createPlaylist } from "../../services/userService";

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
      <div className="static-options">
        <button onClick={() => setView("create")} className="login-btn create-btn">
          <FontAwesomeIcon icon={faPlus} />
          <span>New playlist</span>
        </button>
      </div>

      <div className="playlist-selection-list">
        <List 
          items={playlists}
          type="playlist"
          onMenuClick={(playlist) => handlePlaylistClick(playlist)}
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