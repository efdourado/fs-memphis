import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sessions } from './edition.js';
import { experimentFor, settingsFor, eventsAt } from './soundExperiments.js';
import { createInstrument, createSoundEngine } from './soundEngine.js';

const score = (experiment, settings, bar = 0) => Array.from({ length: 16 }, (_, step) => eventsAt(experiment, settings, step, bar));
const foundation = (events, ids) => events.map(step => step.filter(event => ids.includes(event.partId)));

test('each showcase has its own playable score and valid scene controls', () => {
  const signatures = new Set();
  for (const session of sessions) {
    const experiment = experimentFor(session.slug);
    assert.ok(experiment, session.slug);
    signatures.add(JSON.stringify(experiment.parts));
    const ids = experiment.parts.map(part => part.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const preset of experiment.presets) {
      assert.ok(preset.bpm >= 60 && preset.bpm <= 180);
      assert.ok(preset.enabled.every(id => ids.includes(id)));
      const events = score(experiment, settingsFor(experiment, preset)).flat();
      assert.ok(events.length > 0);
      for (const event of events) {
        assert.ok(event.notes.every(note => Number.isFinite(note) && note >= 24 && note <= 100));
        assert.ok(event.duration > 0 && event.duration < 4);
        assert.ok(event.offset >= 0 && event.offset < .05);
      }
    }
    assert.ok(experiment.parts.every(part => part.hits.every(hit => Number.isInteger(hit.step) && hit.step >= 0 && hit.step < 16)));
  }
  assert.equal(signatures.size, sessions.length, 'showcase songs must not reuse a score');
  assert.equal(experimentFor('unresearched-song'), undefined);
});

test('Dreams grows around the same foundation and width only moves the surrounding parts', () => {
  const experiment = experimentFor('dreams');
  const verse = settingsFor(experiment);
  const chorus = settingsFor(experiment, experiment.presets[2]);
  const fixed = ['drums', 'bass', 'keys'];
  assert.equal(verse.bpm, chorus.bpm);
  assert.deepEqual(foundation(score(experiment, verse), fixed), foundation(score(experiment, chorus), fixed));
  const narrow = score(experiment, { ...chorus, amount: 0 }).flat();
  const wide = score(experiment, { ...chorus, amount: 100 }).flat();
  assert.ok(narrow.every(event => event.pan === 0 && event.spread === 0));
  assert.ok(wide.some(event => event.spread === 1));
  assert.deepEqual(narrow.filter(e => fixed.includes(e.partId)), wide.filter(e => fixed.includes(e.partId)));
});

test('bad guy hands the spotlight to the riff, then actually changes tempo and bass duration', () => {
  const experiment = experimentFor('bad-guy');
  const [verse, hook, ending] = experiment.presets.map(preset => settingsFor(experiment, preset));
  assert.ok(verse.enabled.includes('voice') && !verse.enabled.includes('riff'));
  assert.ok(hook.enabled.includes('riff') && !hook.enabled.includes('voice'));
  assert.equal(hook.bpm, 135); assert.equal(ending.bpm, 120);
  assert.ok(!ending.enabled.includes('bass') && ending.enabled.includes('weight'));
  const bass = score(experiment, verse).flat().filter(e => e.partId === 'bass');
  const weight = score(experiment, ending).flat().find(e => e.partId === 'weight');
  assert.ok(weight.duration > Math.max(...bass.map(e => e.duration)));
  assert.ok(weight.notes[0] < Math.min(...bass.flatMap(e => e.notes)));
});

test('Kate Bush exercise varies only played-style accents and holds the machine fixed', () => {
  const experiment = experimentFor('running-up-that-hill');
  const release = settingsFor(experiment, experiment.presets[2]);
  const grid = score(experiment, { ...release, amount: 0 }).flat();
  const loose = score(experiment, { ...release, amount: 100 }).flat();
  const humanIds = ['fills', 'guitar'];
  assert.deepEqual(grid.filter(e => !humanIds.includes(e.partId)), loose.filter(e => !humanIds.includes(e.partId)));
  assert.ok(grid.every(e => e.offset === 0));
  assert.ok(loose.filter(e => humanIds.includes(e.partId)).every(e => e.offset > 0 && e.gain < 1));
  const nextBar = score(experiment, { ...release, amount: 100 }, 1).flat();
  assert.notDeepEqual(loose.filter(e => humanIds.includes(e.partId)), nextBar.filter(e => humanIds.includes(e.partId)));
});

test('muting every layer is silent and selecting a scene restores its independent settings', () => {
  for (const session of sessions) {
    const experiment = experimentFor(session.slug);
    const settings = settingsFor(experiment);
    settings.enabled.length = 0;
    assert.equal(score(experiment, settings).flat().length, 0);
    assert.ok(settingsFor(experiment).enabled.length > 0);
  }
});

function fakeContext() {
  const nodes = [];
  const param = () => ({ value: 0, events: [], setValueAtTime(value, time) { this.events.push([value, time]); }, exponentialRampToValueAtTime(value, time) { this.events.push([value, time]); } });
  const node = type => {
    const value = { type, gain: param(), frequency: param(), Q: param(), pan: param(), threshold: param(), ratio: param(),
      connect() {}, disconnect() { this.disconnected = true; }, start(time) { this.startAt = time; }, stop(time) { this.stopAt = time; } };
    nodes.push(value); return value;
  };
  return {
    nodes, state: 'running', currentTime: 0, sampleRate: 8000, destination: {}, closeCount: 0,
    createBuffer: (channels, length) => ({ getChannelData: () => new Float32Array(length) }),
    createOscillator: () => node('oscillator'), createBufferSource: () => node('noise'),
    createGain: () => node('gain'), createBiquadFilter: () => node('filter'),
    createStereoPanner: () => node('panner'), createDynamicsCompressor: () => node('compressor'),
    close() { this.closeCount++; this.state = 'closed'; return Promise.resolve(); },
  };
}

test('every scene renders through the real instrument dispatcher with finite timing and cleanup', () => {
  for (const session of sessions) {
    const experiment = experimentFor(session.slug);
    for (const preset of experiment.presets) {
      const ctx = fakeContext();
      const instrument = createInstrument(ctx, {});
      score(experiment, settingsFor(experiment, preset)).forEach((events, step) => events.forEach(event => instrument.play(event, step + .1)));
      const sources = ctx.nodes.filter(node => node.startAt !== undefined);
      assert.ok(sources.length > 0);
      for (const source of sources) {
        assert.ok(Number.isFinite(source.startAt) && source.stopAt > source.startAt);
        source.onended(); assert.equal(source.disconnected, true);
      }
      for (const node of ctx.nodes) for (const param of ['gain', 'frequency', 'pan']) {
        assert.ok(node[param].events.every(([value, time]) => Number.isFinite(value) && Number.isFinite(time)));
      }
    }
  }
});

test('stopping the scheduler closes audio exactly once and prevents restarts', () => {
  const ctx = fakeContext(), experiment = experimentFor('dreams');
  const engine = createSoundEngine(ctx, experiment, () => settingsFor(experiment), () => {});
  engine.start();
  const count = ctx.nodes.length;
  engine.start(); assert.equal(ctx.nodes.length, count);
  engine.stop(); engine.stop(); engine.start();
  assert.equal(ctx.closeCount, 1);
  assert.equal(ctx.nodes.length, count);
});
