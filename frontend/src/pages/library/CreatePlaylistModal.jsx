import React, { useState } from "react";
import PropTypes from "prop-types";

import Modal from "../../components/ui/Modal";
import { createPlaylist } from "../../services/userService";

const CreatePlaylistModal = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    if (!saving) {
      setName("");
      setDescription("");
      setError("");
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const { data } = await createPlaylist({
        name: name.trim(),
        description: description.trim(),
      });
      setName("");
      setDescription("");
      setError("");
      onCreated(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create playlist");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New playlist">
      <form onSubmit={handleSubmit} className="auth-form library-create-form">
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="new-pl-name">Name</label>
          <input
            id="new-pl-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            spellCheck="false"
          />
        </div>
        <div className="form-group">
          <label htmlFor="new-pl-desc">Description (optional)</label>
          <textarea
            id="new-pl-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div className="library-create-form__actions">
          <button type="button" className="login-btn" onClick={handleClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="login-btn always-hover" disabled={saving}>
            {saving ? "Creating…" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

CreatePlaylistModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func.isRequired,
};

export default CreatePlaylistModal;
