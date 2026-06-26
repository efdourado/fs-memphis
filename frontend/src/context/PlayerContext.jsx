import React, { createContext, useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useAudio } from '../hooks/useAudio';
import apiClient from '../services/apiClient';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const pendingPlayTrackIdRef = useRef(null);
  const [state, setState] = useState({
    currentTrack: null,
    isPlaying: false,
    playContext: null,
  });

  const handlePlaybackStarted = useCallback(() => {
    const trackId = state.currentTrack?._id;
    if (!trackId || pendingPlayTrackIdRef.current !== trackId) return;

    pendingPlayTrackIdRef.current = null;
    const contextType = state.playContext?.type?.replace('-main', '') || '';

    if (!trackId) return;
    apiClient.post(`/song/${trackId}/play`, {
      context: state.playContext ? { ...state.playContext, type: contextType } : undefined,
    })
      .catch(err => console.error("Failed to update play count", err));
  }, [state.currentTrack, state.playContext]);

  const playTrack = useCallback((track, context) => {
    if (!track?.audioUrl) return;
    pendingPlayTrackIdRef.current = track._id;
    setState(prev => ({
      ...prev,
      currentTrack: track,
      playContext: context,
      isPlaying: true,
    }));
  }, []);

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
    pendingPlayTrackIdRef.current = null;
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
    onStarted: handlePlaybackStarted,
    onEnded: stopPlayback,
  });

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
