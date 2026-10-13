import { useCallback, useEffect, useRef, useState } from 'react';
import { createSoundPlayer, initialPlaybackState } from './soundPlayer';

export function useSoundPlayer() {
  const [state, setState] = useState(initialPlaybackState);
  const player = useRef(null);
  useEffect(() => {
    const owner = createSoundPlayer({ onChange: setState });
    player.current = owner;
    const hide = () => { if (document.hidden) owner.stop(); };
    document.addEventListener('visibilitychange', hide);
    return () => {
      owner.dispose();
      player.current = null;
      document.removeEventListener('visibilitychange', hide);
    };
  }, []);
  const play = useCallback(options => player.current?.play(options), []);
  const stop = useCallback(() => player.current?.stop(), []);
  return { ...state, play, stop };
}
