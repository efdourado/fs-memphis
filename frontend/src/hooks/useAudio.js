import { useEffect, useRef, useState } from "react";

export const useAudio = ({
  src,
  isPlaying,
  onPlay,
  onPause,
  onEnded,
}) => {
  const audioRef = useRef(new Audio());
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!src) {
      audio.src = '';
      return;
    }

    setIsReady(false);
    audio.src = src;
    audio.load();

    const handleCanPlay = () => setIsReady(true);
    const handleError = () => setIsReady(false);

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [src]);

  useEffect(() => {
    if (!isReady) return;
    
    const audio = audioRef.current;
    
    if (isPlaying) {
      audio.play().catch(error => {
        console.error('Playback failed:', error);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, isReady]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handlePlay = () => onPlay?.();
    const handlePause = () => onPause?.();
    const handleEnded = () => onEnded?.();

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onPlay, onPause, onEnded]);

  const seek = (time) => {
    if (isReady && audioRef.current) {
      audioRef.current.currentTime = time;
  } };

  return {
    audioRef,
    isReady,
    duration,
    currentTime,
    seek
}; };