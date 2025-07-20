import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Modal from '../ui/Modal';
import PlaylistForm from './PlaylistForm';

const PlaylistModal = ({ isOpen, onClose, playlist, onPlaylistUpdated, onDelete }) => {
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSave = async (updatedData) => {
    setIsSaving(true);
    try {
      await onPlaylistUpdated(updatedData);
      onClose();
    } catch (error) {
      console.error("Failed to save playlist from modal", error);
    } finally {
      setIsSaving(false);
  } };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit '${playlist.name}'`}
      onDelete={onDelete}
    >
      <PlaylistForm
        playlist={playlist}
        onSaved={handleSave}
        onCancel={onClose}
        isSaving={isSaving}
        onDelete={onDelete}
      />
    </Modal>
); };

PlaylistModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  playlist: PropTypes.object,
  onPlaylistUpdated: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PlaylistModal;