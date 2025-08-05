import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useAudio } from '../hooks/useAudio';
import apiClient from '../services/apiClient';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [state, setState] = useState({
    currentTrack: null,
    isPlaying: false,
    playContext: null,
  });

  const handlePlayCount = useCallback((trackId) => {
    if (!trackId) return;
    apiClient.post(`/song/${trackId}/play`)
      .catch(err => console.error("Failed to update play count", err));
  }, []);

  const playTrack = useCallback((track, context) => {
    if (!track?.audioUrl) return;
    setState(prev => ({
      ...prev,
      currentTrack: track,
      playContext: context,
      isPlaying: true,
    }));
    handlePlayCount(track._id);
  }, [handlePlayCount]);

  const startPlayback = useCallback((newSongs, newContext) => {
    if (newSongs && newSongs.length > 0) {
      playTrack(newSongs[0], newContext);
    }
  }, [playTrack]);

  const togglePlayPause = useCallback(() => {
    if (!state.currentTrack) return;
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [state.currentTrack]);

  const stopPlayback = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentTrack: null,
      isPlaying: false,
      playContext: null,
  })); }, []);

  const audio = useAudio({
    src: state.currentTrack?.audioUrl || '',
    isPlaying: state.isPlaying,
    onPlay: () => setState(prev => ({ ...prev, isPlaying: true })),
    onPause: () => setState(prev => ({ ...prev, isPlaying: false })),
    onEnded: stopPlayback,
  });

  useEffect(() => {
    if (state.isPlaying && state.currentTrack) {
      handlePlayCount(state.currentTrack._id);
    }
  }, [state.currentTrack?._id, state.isPlaying, handlePlayCount]);

  const value = useMemo(() => ({
    ...state,
    currentTime: audio.currentTime,
    duration: audio.duration,
    playTrack,
    startPlayback,
    togglePlayPause,
    seek: audio.seek,
  }), [state, audio, playTrack, startPlayback, togglePlayPause]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
); };

PlayerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};