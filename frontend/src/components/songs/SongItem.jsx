import React from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faEllipsis } from "@fortawesome/free-solid-svg-icons";

import { useSongMenu } from "../../context/SongMenuContext";
import { usePlayer } from "../../hooks/usePlayer";
import fallbackImage from '/fb.jpg';

const SongItem = React.memo(({ song, onMenuClick, showNumber, index, showImage }) => {
  const player = usePlayer();
  const { openMenu } = useSongMenu();

  if (!song || !song.artist) {
    return null;
  }

  const isCurrent = player?.currentTrack?._id === song._id;
  const isPlaying = isCurrent && player?.isPlaying;
  const hasAudio = !!song.audioUrl;

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasAudio) {
      isCurrent ? player.togglePlayPause() : player.playTrack(song);
    }
  };

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onMenuClick) {
      onMenuClick();
    } else {
      openMenu(song);
  } };

  return (
    <div
      className={`song-item ${isCurrent ? "song-item--active" : ""} ${!hasAudio ? "song-item--disabled" : ""} ${showNumber ? "has-number" : ""}`}
      onDoubleClick={handlePlayClick}
    >
      {showNumber && (
        <div className="song-item-number">
            <span className="number-text">{index + 1}</span>
        </div>
      )}
      <div className="song-item__track">
        {showImage && (
          <div className="song-item__cover-art-container">
            <img
              src={song.coverImage || fallbackImage}
              alt={song.title}
              className="song-item__cover-art"
              onError={(e) => { e.target.src = fallbackImage; }}
            />
            <button
              className="song-item__play-pause-btn"
              onClick={handlePlayClick}
              aria-label={isPlaying ? "Pause" : "Play"}
              disabled={!hasAudio}
            >
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </button>
          </div>
        )}
        <div className="song-item__info">
          <p className="song-item__title">{song.title}</p>
          <p className="song-item__artist">{song.artist.name}</p>
        </div>
      </div>
      
      <div className="song-item__menu-container">
        <button
          className="song-item__menu-btn"
          onClick={handleMenuClick}
          aria-label="More options"
        >
          <FontAwesomeIcon icon={faEllipsis} />
        </button>
      </div>
    </div>
); });

SongItem.propTypes = {
  song: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
    album: PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
    }),
    coverImage: PropTypes.string,
    audioUrl: PropTypes.string,
    isExplicit: PropTypes.bool,
    plays: PropTypes.number,
    duration: PropTypes.number,
  }).isRequired,
  showNumber: PropTypes.bool,
  index: PropTypes.number,
  showImage: PropTypes.bool,
};

export default SongItem;