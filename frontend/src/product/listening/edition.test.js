import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sessions, workFor, sessionFor, editionApi } from './edition.js';
import { sanitizeNotebook, exportNotebook } from './notebook.js';
import { works, people } from '../../../../backend/src/data/catalog.js';
import { compareWorks, searchCatalog, creditsForPerson } from '../../../../backend/src/services/catalogLogic.js';

test('every room has a complete arrangement, takeaways, and a next room', () => {
  assert.equal(sessions.length, 3);
  for (const session of sessions) {
    const work = workFor(session.slug);
    assert.equal(work.depth, 'full');
    assert.ok(work.tryIt.length > 0);
    assert.ok(work.listen.every(link => link.url.startsWith('https://')));
    assert.ok(sessionFor(session.next));
    assert.notEqual(session.slug, session.next);
    assert.ok(session.sections.every(index => work.map.sections[index]));
    assert.ok(work.map.layers.every(layer => layer.cells.length === work.map.sections.length));
    assert.ok(session.options[session.answer]);
  }
});
test('browser edition preserves reviewed catalog and comparison behavior', async () => {
  for (const original of works) {
    const bundled = await editionApi.work(original.slug);
    assert.deepEqual(bundled.credits, original.credits);
    assert.deepEqual(bundled.sources, original.sources);
    assert.deepEqual(bundled.map, original.map);
  }
  const result = await editionApi.compare('dreams', 'bad-guy');
  const expected = compareWorks(works.find(w => w.slug === 'dreams'), works.find(w => w.slug === 'bad-guy'));
  assert.deepEqual(JSON.parse(JSON.stringify(result.dimensions)), expected.dimensions);
  assert.deepEqual(result.sharedPeople, expected.sharedPeople);
  assert.deepEqual((await editionApi.person('finneas')).credits, creditsForPerson('finneas', works));
});
test('local search keeps existing song and people discovery working', async () => {
  for (const query of ['Finneas', 'synth-pop', 'Kate Bush', '[', 'unknown song', '']) {
    const actual = await editionApi.search(query);
    const expected = searchCatalog(query, works, people);
    assert.deepEqual(actual.works.map(w => w.slug), expected.works.map(w => w.slug));
    assert.deepEqual(actual.people.map(p => p.slug), expected.people.map(p => p.slug));
  }
  await assert.rejects(editionApi.compare('dreams', 'dreams'), error => error.response.status === 400);
  await assert.rejects(editionApi.work('missing'), error => error.response.status === 404);
  await assert.rejects(editionApi.person('missing'), error => error.response.status === 404);
});
test('notebook recovers from obsolete and malformed browser data', () => {
  assert.deepEqual(sanitizeNotebook(null), { saved: [], notes: {}, progress: {} });
  const notebook = sanitizeNotebook({ saved: ['dreams:0', 'dreams:0', 'dreams:999', 'missing:0', null, 'dreams:'], notes: { dreams: 'x'.repeat(3000), 'bad-guy': 7, missing: 'ignored' }, progress: { dreams: 3, 'bad-guy': 99, 'running-up-that-hill': 1.5, missing: 1 } });
  assert.deepEqual(notebook.saved, ['dreams:0']);
  assert.equal(notebook.notes.dreams.length, 2000);
  assert.deepEqual(notebook.progress, { dreams: 3 });
});

test('export preserves kept ideas and private reflections as portable text', () => {
  const exported = exportNotebook({ saved: ['dreams:0'], notes: { dreams: 'Listen to the space.\nThen listen again.' } });
  assert.ok(exported.includes('## Three sections, same chords'));
  assert.ok(exported.includes('From Dreams'));
  assert.ok(exported.includes('Listen to the space.\nThen listen again.'));
  assert.equal(exportNotebook({ saved: [], notes: {} }), '# My Memphis notebook\n');
});
