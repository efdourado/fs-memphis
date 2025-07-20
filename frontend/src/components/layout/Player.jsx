import React, { useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBackwardStep,
  faPlay,
  faForwardStep,
  faPause,
} from '@fortawesome/free-solid-svg-icons';

import { PlayerContext } from '../../context/PlayerContext';
import { formatDuration } from '../../utils/duration';
import fallbackImage from '/fb.jpg';

const Player = ({ isSidebarOpen }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    skipTrack,
    seek,
  } = useContext(PlayerContext);

  const progressBarRef = useRef(null);
  const effectiveDuration = duration || currentTrack?.duration || 0;

  const handleProgressClick = (e) => {
    if (!progressBarRef.current || effectiveDuration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const seekTime = clickPosition * effectiveDuration;
    seek(seekTime);
  };

  useEffect(() => {
    if (progressBarRef.current) {
      const progressPercent = effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0;
      progressBarRef.current.style.setProperty("--progress", `${progressPercent}%`);
    }
  }, [currentTime, effectiveDuration]);

  if (!currentTrack) return null;

  return (
    <div className={`player ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="player__content">
        {/* Left Side: Song Info */}
        <div className="player__song-info">
          <img
            src={currentTrack.coverImage || fallbackImage}
            alt={`Cover for ${currentTrack.title}`}
            className="player__cover"
            onError={(e) => { e.target.src = fallbackImage; e.target.onerror = null; }}
          />
          <div className="player__song-details">
            <h3 className="player__title" title={currentTrack.title}>{currentTrack.title}</h3>
            <p className="player__artist" title={currentTrack.artist?.name || 'Unknown Artist'}>
              {currentTrack.artist?.name || 'Unknown Artist'}
            </p>
          </div>
        </div>

        {/* Center: Main Controls & Progress Bar */}
        <div className="player__controls">
          <div className="player__main-controls">
            <button className="player__nav-button" onClick={() => skipTrack('backward')} aria-label="Previous song">
              <FontAwesomeIcon icon={faBackwardStep} />
            </button>
            <button className="player__play-button" onClick={togglePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="lg" />
            </button>
            <button className="player__nav-button" onClick={() => skipTrack('forward')} aria-label="Next song">
              <FontAwesomeIcon icon={faForwardStep} />
            </button>
          </div>
          <div className="player__progress-container">
            <span className="player__time">{formatDuration(currentTime)}</span>
            <div
              ref={progressBarRef}
              className="player__progress-bar"
              onClick={handleProgressClick}
              role="progressbar"
              aria-valuenow={effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Song progress"
            >
              <div className="player__progress-fill" />
            </div>
            <span className="player__time">{formatDuration(effectiveDuration)}</span>
          </div>
        </div>
      </div>
    </div>
); };

Player.propTypes = {
  isSidebarOpen: PropTypes.bool,
};

Player.defaultProps = {
  isSidebarOpen: false,
};

export default Player;