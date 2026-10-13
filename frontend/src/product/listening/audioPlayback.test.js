import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resumeForPlayback } from './audioPlayback.js';

function context(resume) {
  const ctx = new EventTarget();
  ctx.state = 'suspended';
  ctx.resume = resume || (() => { ctx.state = 'running'; return Promise.resolve(); });
  ctx.changeState = state => { ctx.state = state; ctx.dispatchEvent(new Event('statechange')); };
  return ctx;
}

test('selects the iPhone media channel before resuming, then restores it on stop', async () => {
  const audioSession = { type: 'auto' };
  let resumed = false;
  const ctx = context(() => {
    assert.equal(audioSession.type, 'playback');
    resumed = true; ctx.state = 'running';
    return Promise.resolve();
  });
  const playback = resumeForPlayback(ctx, { audioSession });
  assert.equal(resumed, true, 'resume must run synchronously inside the tap gesture');
  await playback.ready;
  playback.stop(); playback.stop();
  assert.equal(audioSession.type, 'auto');
});

test('browsers without a writable Audio Session API still play', async () => {
  for (const audioSession of [undefined, { get type() { return 'auto'; }, set type(value) { throw new Error('unsupported'); } }]) {
    const playback = resumeForPlayback(context(), { audioSession });
    await playback.ready;
    playback.stop();
  }
});

test('blocked resume times out so the UI can offer a retry', async () => {
  const playback = resumeForPlayback(context(() => new Promise(() => {})), { timeoutMs: 5 });
  await assert.rejects(playback.ready, /timed out/);
  playback.stop();
});

test('cancel settles pending resume and ignores its eventual completion', async () => {
  let resume;
  const ctx = context(() => new Promise(resolve => { resume = resolve; }));
  let interruptions = 0;
  const playback = resumeForPlayback(ctx, { onInterrupted: () => interruptions++ });
  const rejected = assert.rejects(playback.ready, /cancelled/);
  playback.stop();
  ctx.state = 'running'; resume();
  await rejected;
  ctx.changeState('interrupted');
  assert.equal(interruptions, 0);
});

test('a resolved resume cannot report success while audio remains suspended', async () => {
  const playback = resumeForPlayback(context(() => Promise.resolve()));
  await assert.rejects(playback.ready, /not running/);
  playback.stop();
});

test('resume failures propagate and release the playback session on cleanup', async () => {
  for (const resume of [() => Promise.reject(new Error('blocked')), () => { throw new Error('blocked'); }]) {
    const audioSession = { type: 'ambient' };
    const playback = resumeForPlayback(context(resume), { audioSession });
    await assert.rejects(playback.ready, /blocked/);
    playback.stop();
    assert.equal(audioSession.type, 'ambient');
  }
});

test('iOS interruption, suspension and closure stop playback; cleanup removes the listener', async () => {
  for (const state of ['interrupted', 'suspended', 'closed']) {
    const ctx = context();
    let interruptions = 0;
    const playback = resumeForPlayback(ctx, { onInterrupted: () => { interruptions++; playback.stop(); } });
    await playback.ready;
    ctx.changeState('running');
    assert.equal(interruptions, 0);
    ctx.changeState(state);
    assert.equal(interruptions, 1);
    ctx.changeState('closed');
    assert.equal(interruptions, 1);
  }
});

test('cleanup preserves a newer audio session policy set by another player', async () => {
  const audioSession = { type: 'auto' };
  const playback = resumeForPlayback(context(), { audioSession });
  await playback.ready;
  audioSession.type = 'ambient';
  playback.stop();
  assert.equal(audioSession.type, 'ambient');
});
