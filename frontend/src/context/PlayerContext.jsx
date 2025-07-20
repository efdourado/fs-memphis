import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import PropTypes from 'prop-types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [state, setState] = useState({
    currentTrack: null,
    isPlaying: false,
    volume: 0.7,
    isMuted: false,
    playContext: null,
  });

  const handlePlayCount = (trackId) => {
    axios.post(`${API_URL}/song/${trackId}/play`)
      .catch(err => console.error("Failed to update play count", err));
  };

  const startPlayback = useCallback((newSongs, newContext) => {
    if (newSongs && newSongs.length > 0) {
      const firstTrack = newSongs[0];
      setSongs(newSongs);
      setState(prev => ({
        ...prev,
        currentTrack: firstTrack,
        playContext: newContext,
        isPlaying: true,
      })); 
      handlePlayCount(firstTrack._id);
  } }, []);

  const skipTrack = useCallback((direction) => {
    if (!state.currentTrack || !songs.length) return;
    
    const currentIndex = songs.findIndex(song => song._id === state.currentTrack._id);
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'forward') {
      nextIndex = (currentIndex + 1) % songs.length;
    } else {
      nextIndex = (currentIndex - 1 + songs.length) % songs.length;
    }

    setState(prev => ({
      ...prev,
      currentTrack: songs[nextIndex],
      isPlaying: true
    }));
  }, [state.currentTrack, songs]);

  const playTrack = useCallback((track) => {
    if (!track?.audioUrl) return;
    startPlayback([track], { type: 'song', id: track._id });
  }, [startPlayback]);

  const togglePlayPause = useCallback(() => {
    if (!state.currentTrack) return;
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [state.currentTrack]);

  const toggleMute = useCallback(() => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const setVolume = useCallback((volume) => {
    setState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  const audio = useAudio({
    src: state.currentTrack?.audioUrl || '',
    volume: state.isMuted ? 0 : state.volume,
    isPlaying: state.isPlaying,
    onPlay: () => setState(prev => ({ ...prev, isPlaying: true })),
    onPause: () => setState(prev => ({ ...prev, isPlaying: false })),
    onEnded: () => skipTrack('forward')
  });
  
  useEffect(() => {
    if (!state.isPlaying && !state.currentTrack) {
      setState(prev => ({ ...prev, playContext: null }));
    }
  }, [state.isPlaying, state.currentTrack]);

  const value = useMemo(() => ({
    ...state,
    songs,
    currentTime: audio.currentTime,
    duration: audio.duration,
    playTrack,
    startPlayback,
    togglePlayPause,
    toggleMute,
    setVolume,
    skipTrack,
    seek: audio.seek,
    setSongs,
  }), [state, audio, playTrack, startPlayback, togglePlayPause, toggleMute, setVolume, skipTrack, songs]);

  useEffect(() => {
    if (state.isPlaying && state.currentTrack) {
      handlePlayCount(state.currentTrack._id);
    }
  }, [state.currentTrack?._id, state.isPlaying]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
); };

PlayerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};