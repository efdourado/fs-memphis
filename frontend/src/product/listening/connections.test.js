import { test } from 'node:test';
import assert from 'node:assert/strict';
import { connections, connectionFor, connectionsForSong, choiceFor, soundForSide, sanitizeDiscoveries } from './connections.js';
import { sessions, workFor } from './edition.js';
import { eventsAt } from './soundExperiments.js';
import { sanitizeNotebook, exportNotebook } from './notebook.js';

test('three pairings connect every showcase pair once, with playable scenes and distinct choices', () => {
  assert.equal(connections.length, 3);
  assert.equal(new Set(connections.map(item => item.id)).size, 3);
  const pairs = new Set();
  for (const connection of connections) {
    assert.equal(connection.sides.length, 2);
    const slugs = connection.sides.map(side => side.slug);
    assert.notEqual(slugs[0], slugs[1]);
    pairs.add([...slugs].sort().join(':'));
    for (const side of connection.sides) {
      assert.equal(workFor(side.slug).depth, 'full');
      const { experiment, settings } = soundForSide(side);
      assert.equal(settings.presetId, side.preset, 'deep pairing must use the intended scene');
      assert.ok(Array.from({ length: 16 }, (_, step) => eventsAt(experiment, settings, step)).flat().length > 0);
      const again = soundForSide(side);
      settings.enabled.length = 0;
      assert.ok(again.settings.enabled.length > 0, 'playing or modifying a scene cannot mutate its source');
    }
    assert.equal(new Set(connection.choices.map(item => item.id)).size, 3);
    assert.equal(new Set(connection.choices.map(item => item.prompt)).size, 3);
    assert.ok(connection.choices.every(item => item.takeaway && item.prompt && item.label));
  }
  assert.equal(pairs.size, 3);
  for (const session of sessions) assert.equal(connectionsForSong(session.slug).length, 2);
  assert.equal(connectionFor('missing'), undefined);
  assert.equal(choiceFor('make-space', 'missing'), undefined);
  assert.equal(soundForSide({ slug: 'dreams', preset: 'missing' }), null);
});

test('notebook migration keeps existing ideas, notes and progress', () => {
  const old = { saved: ['dreams:0'], notes: { dreams: 'The bass stays.' }, progress: { dreams: 3 } };
  assert.deepEqual(sanitizeNotebook(old), { ...old, discoveries: [] });
  assert.equal(exportNotebook(old), exportNotebook({ ...old, discoveries: [] }));
});

test('invalid discoveries are discarded, valid choices deduplicated and notes bounded', () => {
  const value = [null, 17, {}, { id: 'missing', choiceId: 'both' }, { id: 'make-space', choiceId: 'missing' },
    { id: 'make-space', choiceId: 'space', note: 'x'.repeat(2000) }, { id: 'make-space', choiceId: 'width', note: 'duplicate' },
    { id: 'keep-the-pulse', choiceId: 'restless', note: 42 }, { id: 'change-the-ending', choiceId: 'turn', note: 'Keep\nthe detail.' }];
  const actual = sanitizeDiscoveries(value);
  assert.deepEqual(actual, [
    { id: 'make-space', choiceId: 'space', note: 'x'.repeat(1000) },
    { id: 'keep-the-pulse', choiceId: 'restless', note: '' },
    { id: 'change-the-ending', choiceId: 'turn', note: 'Keep\nthe detail.' },
  ]);
  for (const invalid of [undefined, null, {}, 'text', 17]) assert.deepEqual(sanitizeDiscoveries(invalid), []);
  assert.deepEqual(sanitizeNotebook({ discoveries: value }).discoveries, actual);
});

test('a discovery survives storage round trip and export with its choice, pairing and note', () => {
  const notebook = sanitizeNotebook({ discoveries: [{ id: 'make-space', choiceId: 'space', note: 'That tiny melody.\nThe gap around it.' }] });
  assert.deepEqual(sanitizeNotebook(JSON.parse(JSON.stringify(notebook))), notebook);
  const exported = exportNotebook(notebook);
  assert.ok(exported.includes('Dreams ↔ bad guy'));
  assert.ok(exported.includes('I chose: One detail with room to stand out'));
  assert.ok(exported.includes('Make space before adding another part.'));
  assert.ok(exported.includes('Next listen: On your next hook'));
  assert.ok(exported.includes('My reflection: That tiny melody.\nThe gap around it.'));
});
