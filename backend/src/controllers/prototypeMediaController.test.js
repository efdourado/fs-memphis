import assert from 'node:assert/strict';
import test from 'node:test';

import { createPrototypeCover, createPrototypeWav } from './prototypeMediaController.js';

test('creates a valid PCM WAV prototype', () => {
  const wav = createPrototypeWav('first-light');

  assert.equal(wav.subarray(0, 4).toString(), 'RIFF');
  assert.equal(wav.subarray(8, 12).toString(), 'WAVE');
  assert.equal(wav.subarray(36, 40).toString(), 'data');
  assert.equal(wav.readUInt32LE(40), wav.length - 44);
});

test('creates deterministic Memphis-owned SVG artwork', () => {
  const first = createPrototypeCover('afterimage');
  const second = createPrototypeCover('afterimage');

  assert.equal(first, second);
  assert.match(first, /<svg/);
  assert.match(first, /MEMPHIS/);
  assert.match(first, /PROTOTYPE AUDIO/);
});
