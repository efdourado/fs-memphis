import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faEllipsis, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

import { usePlayer } from '../../hooks/usePlayer';
import { useSongModal } from '../../context/SongModalContext';
import fallbackImage from '/fb.jpg';

const Item = ({ item, type, index, showImage, showNumber, onMenuClick, isAdded }) => {
  const player = usePlayer();
  const { openMenu } = useSongModal();

  if (!item) return null;

  const isCurrent = player?.currentTrack?._id === item._id;
  const isPlaying = isCurrent && player?.isPlaying;
  const hasAudio = !!item.audioUrl;

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasAudio) {
      isCurrent ? player.togglePlayPause() : player.playTrack(item);
    }
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    if (onMenuClick) {
      onMenuClick(item);
    } else {
      openMenu(item);
    }
  };
  
  const handleItemClick = () => {
    if (type === 'playlist' && onMenuClick) {
      onMenuClick(item);
    }
  };
  
  const handleItemDoubleClick = () => {
    if (hasAudio && type === 'song') {
      player.playTrack(item);
    }
  };

  const title = item.title || item.name;
  const subtitle = type === 'song' ? item.artist?.name : `Playlist by ${item.owner?.name}`;
  const imageUrl = item.album?.coverImage || item.coverImage || fallbackImage;

  return (
    <div
      className={`item ${isCurrent ? "item--active" : ""} ${!hasAudio && type === 'song' ? "item--disabled" : ""} ${showNumber ? "has-number" : ""}`}
      onClick={handleItemClick}
      onDoubleClick={handleItemDoubleClick}
    >
      {showNumber && (
        <div className="item-number">
          <span className="number-text">{index + 1}</span>
        </div>
      )}

      <div className="item__track">
        {showImage && (
          <div className="item__cover-art-container">
            <img
              src={imageUrl}
              alt={title}
              className="item__cover-art"
              onError={(e) => { e.target.src = fallbackImage; }}
            />
            {type === 'song' && (
              <button
                className="item__play-pause-btn"
                onClick={handlePlayClick}
                aria-label={isPlaying ? "Pause" : "Play"}
                disabled={!hasAudio}
              >
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </button>
            )}
          </div>
        )}
        <div className="item__info">
          <p className="item__title">{title}</p>
          <p className="item__artist">{subtitle}</p>
        </div>
      </div>
      
      <div className="item__actions">
        {type === 'song' ? (
          <button
            className="item__menu-btn"
            onClick={handleMenuClick}
            aria-label="More options"
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
        ) : type === 'playlist' ? (
          <div className="item__checkbox-container">
            <FontAwesomeIcon 
              icon={isAdded ? faCheckCircle : faCircle} 
              className={`item__checkbox-icon ${isAdded ? 'checked' : ''}`} 
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

Item.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    artist: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
    album: PropTypes.shape({
      coverImage: PropTypes.string,
    }),
    owner: PropTypes.shape({
      name: PropTypes.string,
    }),
    coverImage: PropTypes.string,
    audioUrl: PropTypes.string,
  }).isRequired,
  type: PropTypes.oneOf(['song', 'playlist', 'album']).isRequired,
  index: PropTypes.number,
  showImage: PropTypes.bool,
  showNumber: PropTypes.bool,
  onMenuClick: PropTypes.func,
  isAdded: PropTypes.bool,
};

Item.defaultProps = {
  type: 'song',
  isAdded: false,
};

export default React.memo(Item);