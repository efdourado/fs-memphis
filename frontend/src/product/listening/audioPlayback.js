// Keep resume() inside the Play gesture. On iOS 17+, playback uses the media
// channel; the default ambient channel is silenced by the iPhone Silent switch.
export function resumeForPlayback(ctx, { audioSession, onInterrupted, timeoutMs = 5000 } = {}) {
  let previousType, changedType = false, settled = false, stopped = false, running = false;
  try {
    if (audioSession) {
      previousType = audioSession.type;
      audioSession.type = 'playback';
      changedType = true;
    }
  } catch { /* Unsupported session policies must not block normal Web Audio. */ }

  let timer, rejectStart;
  const stateChanged = () => {
    if (running && !stopped && ctx.state !== 'running') onInterrupted?.();
  };
  ctx.addEventListener('statechange', stateChanged);
  const ready = new Promise((resolve, reject) => {
    rejectStart = reject;
    const finish = error => {
      if (settled || stopped) return;
      settled = true;
      clearTimeout(timer);
      if (error) reject(error);
      else { running = true; resolve(); }
    };
    timer = setTimeout(() => finish(new Error('Audio start timed out')), timeoutMs);
    try {
      Promise.resolve(ctx.resume()).then(() => {
        finish(ctx.state === 'running' ? null : new Error('Audio is not running'));
      }, finish);
    } catch (error) { finish(error); }
  });

  return {
    ready,
    stop() {
      if (stopped) return;
      stopped = true;
      clearTimeout(timer);
      ctx.removeEventListener('statechange', stateChanged);
      if (!settled) { settled = true; rejectStart(new Error('Audio start cancelled')); }
      try {
        if (changedType && audioSession.type === 'playback') audioSession.type = previousType;
      } catch { /* Session policies can change when the page loses focus. */ }
    },
  };
}
