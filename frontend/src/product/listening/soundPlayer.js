import { createSoundEngine } from './soundEngine.js';
import { resumeForPlayback } from './audioPlayback.js';

export const initialPlaybackState = { activeId: null, starting: false, step: -1, error: '' };

// A single audio owner, independent of React so cancellation and switching can
// be tested with delayed browser resumes as well as normal playback.
export function createSoundPlayer({
  onChange,
  createContext = () => {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) throw new Error('unavailable');
    return new Audio();
  },
  getAudioSession = () => navigator.audioSession,
  createEngine = createSoundEngine,
}) {
  let current = null, generation = 0, disposed = false, state = initialPlaybackState;
  const publish = patch => {
    if (disposed) return;
    state = { ...state, ...patch };
    onChange(state);
  };
  const stop = () => {
    generation++;
    current?.stop();
    current = null;
    publish({ activeId: null, starting: false, step: -1 });
  };
  const play = async ({ id, experiment, readSettings }) => {
    if (disposed) return;
    if (current?.id === id) { stop(); return; }
    stop(); publish({ error: '', starting: true, activeId: id });
    const token = ++generation;
    let ctx, engine, playback;
    try {
      ctx = createContext();
      engine = createEngine(ctx, experiment, readSettings, step => {
        if (token === generation) publish({ step });
      });
      playback = resumeForPlayback(ctx, {
        audioSession: getAudioSession(),
        onInterrupted: () => {
          if (!disposed && token === generation) {
            stop(); publish({ error: 'Audio was interrupted. Tap Play to listen again.' });
          }
        },
      });
      current = { id, stop: () => { playback.stop(); engine.stop(); } };
      await playback.ready;
      if (disposed || token !== generation) { playback.stop(); engine.stop(); return; }
      engine.start(); publish({ starting: false });
    } catch {
      playback?.stop(); engine?.stop();
      if (ctx && !engine && ctx.state !== 'closed') ctx.close().catch(() => {});
      if (!disposed && token === generation) {
        stop(); publish({ error: 'Audio could not start. Tap Play to retry. If it still won’t start, reload this page in Safari or Chrome.' });
      }
    }
  };
  return { play, stop, dispose() { disposed = true; stop(); } };
}
