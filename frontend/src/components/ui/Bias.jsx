import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faEllipsis, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { useSongModal } from "../../context/SongModalContext";
import { usePlayer } from '../../hooks/usePlayer';
import { useAuth } from '../../context/AuthContext';

import SoundWave from './SoundWave';
import PlaylistModal from '../../components/playlists/PlaylistModal';
import { deletePlaylist } from "../../services/userService";
import * as collectionService from '../../services/collectionService';

import fallbackImage from '/fb.jpg';

const Bias = ({ item, type }) => {
  const player = usePlayer();
  const { openMenu } = useSongModal();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const isPlaying = useMemo(() => {
    if (!player.isPlaying || !item) return false;
    if (type === 'song') return player.currentTrack?._id === item._id;
    return player.playContext?.type === type && player.playContext?.id === item._id;
  }, [player.isPlaying, player.currentTrack, player.playContext, item, type]);

  const subtitle = useMemo(() => {
    if (!item) return "";
    if (type === 'song') return item.artist?.name || "Unknown Artist";
    if (type === 'playlist') return `Playlist by ${item.owner?.name || "Unknown"}`;
    if (type === 'album') return item.artist?.name || "Unknown Artist";
    return "";
  }, [item, type]);

  if (!item) return null;

  const title = item.title || item.name;
  const imageUrl = item.album?.coverImage || item.image || fallbackImage;
  const detailPath = type === 'song' && item.album?._id ? `/album/${item.album._id}` : `/${type}/${item._id}`;
  const isOwner = currentUser && type === "playlist" && currentUser._id === item.owner?._id;

  const handlePlayClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPlaying) {
      player.togglePlayPause();
      return;
    }

    if (type === 'song' && item.audioUrl) {
      player.playTrack(item);
      return;
    }

    if (type === 'playlist' || type === 'album') {
      setIsLoading(true);
      try {
        const fetcher = type === 'playlist' ? collectionService.fetchPlaylistById : collectionService.fetchAlbumById;
        const { data } = await fetcher(item._id);
        const tracks = data?.songs?.map(s => s.song || s).filter(Boolean) || [];

        if (tracks.length > 0) {
          player.startPlayback(tracks, { type, id: item._id });
        }
      } catch (err) {
        console.error(`Failed to fetch ${type} for playback`, err);
      } finally {
        setIsLoading(false);
  } } };

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOwner) {
      setEditModalOpen(true);
    } else if (type === 'song') {
      openMenu(item);
  } };

  const handleDeletePlaylist = async () => {
    if (!isOwner) return;
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await deletePlaylist(item._id);
        setEditModalOpen(false);

        navigate('/library'); 
      } catch (err) {
        console.error('Failed to delete playlist:', err);
  } } };
  
  return (
    <>
      <Link to={detailPath} className="bias-card-link-wrapper">
        <div className={`bias-card ${isPlaying ? 'is-playing' : ''}`}>
          <div className="bias-card__cover">
            <img
              src={imageUrl}
              alt={`Cover for ${title}`}
              onError={(e) => { e.target.src = fallbackImage; }}
            />
          </div>
          
          <div className="bias-card__content">
            <div className="bias-card__text">
              <h3 className="bias-card__title">
                {title}
                {isPlaying && <SoundWave />}
              </h3>
              <p className="bias-card__subtitle">{subtitle}</p>
            </div>

            <div className="bias-card__actions">
              <button 
                className="action-btn play" 
                onClick={handlePlayClick} 
                aria-label={isPlaying ? "Pause" : "Play"}
                disabled={isLoading}
              >
                {isLoading 
                  ? <FontAwesomeIcon icon={faSpinner} spin /> 
                  : <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                }
              </button>

              {(isOwner || type === 'song') && (
                <button
                  className="action-btn menu"
                  onClick={handleMenuClick}
                  aria-label="More options"
                >
                  <FontAwesomeIcon icon={faEllipsis} />
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>

      {isOwner && (
        <PlaylistModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          playlist={item}

          onPlaylistUpdated={() => {
            setEditModalOpen(false);
            window.location.reload(); 
          }}
          onDelete={handleDeletePlaylist}
        />
      )}
    </>
); };

Bias.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    coverImage: PropTypes.string,
    image: PropTypes.string,
    artist: PropTypes.shape({ name: PropTypes.string }),
    owner: PropTypes.shape({ name: PropTypes.string, _id: PropTypes.string }),
    audioUrl: PropTypes.string,
  }).isRequired,
  type: PropTypes.oneOf(['song', 'playlist', 'album']).isRequired,
};

export default Bias;