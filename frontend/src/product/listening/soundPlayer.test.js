import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSoundPlayer } from './soundPlayer.js';

function harness({ delayed = false, failEngine = false } = {}) {
  const contexts = [], engines = [], states = [], audioSession = { type: 'auto' };
  const player = createSoundPlayer({
    onChange: state => states.push(state),
    getAudioSession: () => audioSession,
    createContext: () => {
      const ctx = new EventTarget();
      ctx.state = 'suspended'; ctx.closes = 0;
      ctx.resume = () => new Promise(resolve => {
        ctx.finishResume = () => { if (ctx.state !== 'closed') ctx.state = 'running'; resolve(); };
        if (!delayed) ctx.finishResume();
      });
      ctx.close = () => { ctx.closes++; ctx.state = 'closed'; return Promise.resolve(); };
      contexts.push(ctx);
      return ctx;
    },
    createEngine: (ctx, experiment, readSettings, onStep) => {
      if (failEngine) throw new Error('engine failure');
      const engine = { starts: 0, stopped: false, onStep, readSettings,
        start() { this.starts++; },
        stop() { if (!this.stopped) { this.stopped = true; ctx.close(); } },
      };
      engines.push(engine);
      return engine;
    },
  });
  return { player, contexts, engines, states, audioSession, state: () => states.at(-1) };
}
const options = id => ({ id, experiment: {}, readSettings: () => ({}) });

test('switching sketches closes the old context and keeps exactly one engine active', async () => {
  const h = harness();
  await h.player.play(options('A'));
  assert.equal(h.state().activeId, 'A');
  assert.equal(h.state().starting, false);
  await h.player.play(options('B'));
  assert.equal(h.contexts[0].state, 'closed');
  assert.equal(h.contexts[1].state, 'running');
  assert.equal(h.engines.filter(engine => !engine.stopped).length, 1);
  assert.equal(h.audioSession.type, 'playback');
  h.engines[0].onStep(12);
  assert.equal(h.state().step, -1, 'stale step events cannot animate the new sketch');
  h.engines[1].onStep(3);
  assert.equal(h.state().step, 3);
  await h.player.play(options('B'));
  assert.equal(h.state().activeId, null, 'tapping the active sketch stops it');
  assert.equal(h.contexts[1].state, 'closed');
  assert.equal(h.audioSession.type, 'auto');
  h.player.dispose();
});

test('rapid switching cancels pending resume without starting or erroring the replacement', async () => {
  const h = harness({ delayed: true });
  const first = h.player.play(options('A'));
  const second = h.player.play(options('B'));
  h.contexts[1].finishResume();
  await second;
  h.contexts[0].finishResume();
  await first;
  assert.deepEqual(h.engines.map(engine => engine.starts), [0, 1]);
  assert.equal(h.state().activeId, 'B');
  assert.equal(h.state().error, '');
  assert.equal(h.audioSession.type, 'playback');
  h.player.dispose();
  assert.equal(h.audioSession.type, 'auto');
});

test('navigation during startup cancels playback and never publishes after disposal', async () => {
  const h = harness({ delayed: true });
  const pending = h.player.play(options('A'));
  h.player.dispose();
  const before = h.states.length;
  h.contexts[0].finishResume();
  await pending;
  assert.equal(h.engines[0].starts, 0);
  assert.equal(h.contexts[0].closes, 1);
  assert.equal(h.states.length, before);
  await h.player.play(options('B'));
  assert.equal(h.contexts.length, 1);
});

test('interrupted playback returns to Play with a useful message, then can retry', async () => {
  const h = harness();
  await h.player.play(options('A'));
  h.contexts[0].state = 'interrupted';
  h.contexts[0].dispatchEvent(new Event('statechange'));
  assert.equal(h.state().activeId, null);
  assert.match(h.state().error, /interrupted/);
  await h.player.play(options('A'));
  assert.equal(h.state().activeId, 'A');
  assert.equal(h.state().error, '');
  h.player.dispose();
});

test('engine setup failures close the context and leave a retryable UI', async () => {
  const h = harness({ failEngine: true });
  await h.player.play(options('A'));
  assert.equal(h.contexts[0].state, 'closed');
  assert.equal(h.state().activeId, null);
  assert.equal(h.state().starting, false);
  assert.match(h.state().error, /could not start/);
  h.player.dispose();
});

test('live settings are read from the current room controls without restarting', async () => {
  const h = harness();
  let settings = { bpm: 112, enabled: ['bass'] };
  await h.player.play({ ...options('dreams'), readSettings: () => settings });
  settings = { bpm: 112, enabled: ['bass', 'harmony'] };
  assert.deepEqual(h.engines[0].readSettings(), settings);
  assert.equal(h.engines[0].starts, 1);
  h.player.stop(); h.player.stop();
  assert.equal(h.contexts[0].closes, 1);
  h.player.dispose();
});
