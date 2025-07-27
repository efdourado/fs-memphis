import React, { useContext, useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

import { PlayerContext } from '../../context/PlayerContext';
import fallbackImage from '/fb.jpg';

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
  } = useContext(PlayerContext);
  
  const [isHovered, setIsHovered] = useState(false);
  const circleRef = useRef(null);
  
  const effectiveDuration = duration || currentTrack?.duration || 0;
  
  if (!currentTrack) return null;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progress = effectiveDuration > 0 ? (currentTime / effectiveDuration) : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div 
      className={`player-disc ${isPlaying ? 'is-playing' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={togglePlayPause}
    >
      <div className="player-disc__art-wrapper">
        <img
          src={currentTrack.album?.coverImage || fallbackImage}
          alt={`Cover for ${currentTrack.title}`}
          className="player-disc__art"
          onError={(e) => { e.target.src = fallbackImage; }}
        />
      </div>

      <svg className="player-disc__progress" width="80" height="80" viewBox="0 0 80 80">
        <circle
          className="player-disc__progress-bg"
          cx="40" cy="40" r={radius}
        />
        <circle
          ref={circleRef}
          className="player-disc__progress-fg"
          cx="40" cy="40" r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      
      {(isHovered || isPlaying) && (
        <div className="player-disc__controls">
          <button className="player-disc__play-button" aria-label={isPlaying ? 'Pause' : 'Play'}>
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
        </div>
      )}
    </div>
); };

export default Player;