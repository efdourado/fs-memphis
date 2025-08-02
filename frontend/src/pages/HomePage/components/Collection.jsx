import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { fetchAlbumById, fetchPlaylistById } from '../../../services/collectionService';
import { deletePlaylist } from '../../../services/userService';
import { formatTotalDuration } from '../../../utils/formatters';
import List from '../../../components/ui/List';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import SoundWave from '../../../components/ui/SoundWave';
import PlaylistModal from '../../../components/playlists/PlaylistModal';
import { useSongModal } from '../../../context/SongModalContext';
import { usePlayer } from '../../../hooks/usePlayer';
import { useAuth } from '../../../context/AuthContext';
import fallbackImage from '/fb.jpg';

const Collection = ({ collectionId, type = "album" }) => {
  const [collection, setCollection] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { startPlayback, playContext, isPlaying, togglePlayPause } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);
  const { openMenu } = useSongModal();
  const { currentUser } = useAuth();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadCollectionData = useCallback(async () => {
    try {
      setLoading(true);
      const fetcher = type === "album" ? fetchAlbumById : fetchPlaylistById;
      const { data: collectionData } = await fetcher(collectionId);

      if (collectionData) {
        setCollection(collectionData);
        const tracks =
          type === "playlist"
            ? collectionData.songs.map((item) => item.song).filter(Boolean)
            : collectionData.songs || [];
        setSongs(tracks);
      }
    } catch (error) {
      console.error(`Error loading ${type} data:`, error);
    } finally {
      setLoading(false);
    }
  }, [collectionId, type]);

  useEffect(() => {
    if (collectionId) {
      loadCollectionData();
    }
  }, [collectionId, loadCollectionData]);

  const totalDuration = useMemo(() => {
    if (!songs || songs.length === 0) return 0;
    return songs.reduce((acc, song) => acc + (song?.duration || 0), 0);
  }, [songs]);

  const isCollectionCurrentlyPlaying = playContext?.type === type && playContext?.id === collectionId && isPlaying;
  const isOwner = currentUser && collection && type === "playlist" && currentUser._id === collection.owner?._id;
  const detailPath = `/${type}/${collection?._id}`;

  const handleNavigate = () => {
    navigate(detailPath);
  };
  
  const handlePlayCollection = (e) => {
    e.stopPropagation();
    if (playContext?.type === type && playContext?.id === collectionId) {
      togglePlayPause();
    } else if (songs?.length > 0) {
      startPlayback(songs, { type, id: collectionId });
  } };

  const handleMenuClick = (e, song = null) => {
    e.stopPropagation();
    if (type === 'playlist' && isOwner) {
      setEditModalOpen(true);
    } else if (song) {
      openMenu(song);
  } };
  
  const handleCloseEditModal = () => setEditModalOpen(false);

  const handlePlaylistUpdated = (updatedPlaylistData) => {
    setCollection(prev => ({ ...prev, ...updatedPlaylistData }));
  };

  const handleDeletePlaylist = async () => {
    if (!collection || type !== 'playlist') return;
    if (window.confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) {
      try {
        await deletePlaylist(collection._id);
        handleCloseEditModal();
        navigate('/library');
      } catch (err) {
        console.error('Failed to delete playlist:', err);
        alert('Failed to delete playlist.');
  } } };

  if (loading) return <LoadingSpinner />;
  if (!collection) return <div className="collection-view error">Failed to load collection.</div>;

  const collectionName = type === "artist" ? collection.name : (collection.name || collection.title);
  const ownerName = type === "artist" ? "Artist" : (collection.owner?.name || collection.artist?.name);
  const coverImageUrl = type === "artist" ? collection.profilePic : collection.coverImage || fallbackImage;

  return (
    <>
      <div
        className={`collection-view__content ${isCollectionCurrentlyPlaying ? "is-playing" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="collection-view__info-panel" onClick={handleNavigate} style={{ cursor: 'pointer' }}>
          <div className="collection-view__cover-art">
            <img src={coverImageUrl} alt={collectionName} />
          </div>
          <div className="collection-view__details">
            <h1 className="collection-view__title">
              {collectionName}
              {isCollectionCurrentlyPlaying && <SoundWave />}
            </h1>
            <p className="collection-view__owner">By {ownerName}</p>
            <div className="collection-view__meta">
              {type === "album" && collection.releaseDate && (
                <>
                  <span>{new Date(collection.releaseDate).getFullYear()}</span>
                  <span className="meta-divider">•</span>
                </>
              )}
              {songs.length > 0 && (
                <span>
                  {`${songs.length} songs`}
                  {totalDuration > 0 && `, ${formatTotalDuration(totalDuration)}`}
                </span>
              )}
            </div>
            {collection.description && (
              <p className="collection-view__description">
                {collection.description}
              </p>
            )}
            <div className={`collection-view__actions ${isHovered || isCollectionCurrentlyPlaying ? "visible" : ""}`}>
              <button
                className="action-btn menu"
                onClick={(e) => handleMenuClick(e, null)}
                aria-label="More options"
              >
                <FontAwesomeIcon icon={faEllipsis} />
              </button>
              <button
                className="action-btn play"
                onClick={handlePlayCollection}
                aria-label={`Play ${collectionName}`}
              >
                <FontAwesomeIcon icon={isCollectionCurrentlyPlaying ? faPause : faPlay} />
              </button>
            </div>
          </div>
        </div>
        <div className="collection-view__tracks-panel">
          <List
            items={songs}
            type="song"
            showHeader={false}
            displayAll={true}
            showNumber={true}
            showImage={false}
            onMenuClick={(song) => handleMenuClick(event, song)}
          />
        </div>
      </div>

      {type === 'playlist' && isOwner && collection && (
        <PlaylistModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          playlist={collection}
          onPlaylistUpdated={handlePlaylistUpdated}
          onDelete={handleDeletePlaylist}
        />
      )}
    </>
); };

Collection.propTypes = {
  collectionId: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["album", "playlist", "artist"]),
};

export default Collection;