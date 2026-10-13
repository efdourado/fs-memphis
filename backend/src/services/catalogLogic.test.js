import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanSubmission,
  collaboratorsOf,
  compareWorks,
  connectionsFor,
  creditsForPerson,
  mapProblems,
  markUpdates,
  searchCatalog,
  sharedPeople,
} from './catalogLogic.js';
import { people, updates, works } from '../data/catalog.js';
import { STATUSES } from '../persistence/models/workModel.js';

const bySlug = (slug) => works.find((w) => w.slug === slug);

test('sharedPeople lists each credited person once', () => {
  const shared = sharedPeople(bySlug('die-young'), bySlug('teenage-dream'));
  assert.deepEqual(shared.map((p) => p.slug).sort(), ['benny-blanco', 'dr-luke']);
});

test('connectionsFor keeps curated reasons and adds computed shared credits', () => {
  const connections = connectionsFor(bySlug('blinding-lights'), works);
  const curated = connections.find((c) => c.work.slug === 'running-up-that-hill');
  assert.equal(curated.status, 'editorial');
  const computed = connections.filter((c) => c.status === 'computed').map((c) => c.work.slug).sort();
  assert.deepEqual(computed, ['baby-one-more-time', 'cant-feel-my-face', 'teenage-dream']);
  assert.match(connections.find((c) => c.work.slug === 'cant-feel-my-face').reason, /Max Martin/);
  assert.ok(!connections.some((c) => c.work.slug === 'blinding-lights'));
});

test('compareWorks aligns dimensions and keeps missing ones empty', () => {
  const result = compareWorks(
    { slug: 'a', title: 'A', dimensions: [{ label: 'Voice', body: 'x', status: 'editorial' }], credits: [] },
    { slug: 'b', title: 'B', dimensions: [{ label: 'Pulse', body: 'y', status: 'editorial' }], credits: [] },
  );
  assert.deepEqual(result.dimensions.map((d) => d.label), ['Voice', 'Pulse']);
  assert.equal(result.dimensions[0].b, null);
});

test('markUpdates flags updates about saved songs and followed people since last visit', () => {
  const list = [
    { key: '1', date: '2026-10-01', workSlugs: ['dreams'], personSlugs: [] },
    { key: '2', date: '2026-09-01', workSlugs: [], personSlugs: ['finneas'] },
    { key: '3', date: '2026-10-05', workSlugs: ['espresso'], personSlugs: [] },
  ];
  const { items, unseen } = markUpdates(list, {
    savedWorks: [{ slug: 'dreams' }],
    following: [{ slug: 'finneas' }],
    updatesSeenAt: '2026-09-15',
  });
  assert.deepEqual(items.map((i) => i.relevant), [true, true, false]);
  assert.deepEqual(items.map((i) => i.isNew), [true, false, false]);
  assert.equal(unseen, 1);
});

test('searchCatalog matches titles, artists, credits and alternative names', () => {
  const result = searchCatalog('gottwald', works, people);
  assert.deepEqual(result.people.map((p) => p.slug), ['dr-luke']);
  assert.ok(searchCatalog('billie', works, people).works.length === 2);
  assert.equal(searchCatalog('max martin', works, people).works.length, 4);
  assert.deepEqual(searchCatalog('   ', works, people), { works: [], people: [] });
  assert.doesNotThrow(() => searchCatalog('(', works, people));
});

test('person pages are computed from credits', () => {
  assert.equal(creditsForPerson('max-martin', works).length, 4);
  const collaborators = collaboratorsOf('finneas', works);
  assert.deepEqual(collaborators[0], { slug: 'billie-eilish', name: 'Billie Eilish', works: ['Bad Guy', 'Birds of a Feather'] });
});

test('mapProblems catches rows that do not match the sections', () => {
  assert.deepEqual(mapProblems({ sections: ['a', 'b'], layers: [{ name: 'Drums', cells: [2, 2] }] }), []);
  assert.equal(mapProblems({ sections: ['a', 'b'], layers: [{ name: 'Drums', cells: [2] }] }).length, 1);
  assert.equal(mapProblems({ sections: ['a'], layers: [{ name: 'Drums', cells: [7] }] }).length, 1);
});

test('cleanSubmission asks for a name, a title, a link and a story', () => {
  assert.equal(cleanSubmission({}).errors.length, 4);
  const good = cleanSubmission({
    artist: ' Ana ',
    title: 'Stairwell',
    link: 'https://example.com/song',
    story: 'I recorded the vocal in a stairwell because the room was the reverb I wanted, then cut one synth take into every other part.',
  });
  assert.deepEqual(good.errors, []);
  assert.equal(good.submission.artist, 'Ana');
  assert.equal(cleanSubmission({ ...good.submission, link: 'javascript:alert(1)' }).errors.length, 1);
});

test('catalog data is internally consistent', () => {
  const personSlugs = new Set(people.map((p) => p.slug));
  const workSlugs = new Set(works.map((w) => w.slug));
  assert.equal(workSlugs.size, works.length);

  for (const work of works) {
    const sourceIds = new Set(work.sources.map((s) => s.id));
    const claims = [
      ...work.facts, ...work.events, ...work.guide, ...work.observations, ...work.dimensions, ...work.credits,
      ...(work.figures || []), ...(work.making || []), ...(work.moments || []), ...(work.versions || []),
    ];
    for (const claim of claims) {
      assert.ok(STATUSES.includes(claim.status), `${work.slug}: unknown status ${claim.status}`);
      if (claim.status === 'verified') {
        assert.ok(sourceIds.has(claim.sourceId), `${work.slug}: verified claim without a source`);
      }
    }
    for (const credit of work.credits) assert.ok(personSlugs.has(credit.personSlug), `${work.slug}: unknown person ${credit.personSlug}`);
    for (const slug of [...work.connections.map((c) => c.workSlug), ...work.compareWith]) {
      assert.ok(workSlugs.has(slug), `${work.slug}: unknown work ${slug}`);
    }
    assert.ok(work.hook, `${work.slug}: every card needs its one idea`);
    assert.equal(work.attention, undefined, `${work.slug}: demo attention curves are not shown`);
  }

  for (const update of updates) {
    for (const slug of update.workSlugs) assert.ok(workSlugs.has(slug), `update ${update.key}: unknown work`);
    for (const slug of update.personSlugs) assert.ok(personSlugs.has(slug), `update ${update.key}: unknown person`);
  }
});

test('a full page has every block and a well-formed map', () => {
  const full = works.filter((w) => w.depth === 'full');
  assert.deepEqual(full.map((w) => w.slug).sort(), ['bad-guy', 'dreams', 'running-up-that-hill']);
  for (const work of full) {
    assert.ok(work.idea, `${work.slug}: idea`);
    assert.ok(work.figures.length >= 3, `${work.slug}: figures`);
    assert.ok(work.making.length >= 5, `${work.slug}: making-of`);
    assert.ok(work.why.length >= 1, `${work.slug}: why it works`);
    assert.ok(work.tryIt.length >= 3, `${work.slug}: things to try`);
    assert.ok(work.versions.length >= 2, `${work.slug}: versions`);
    assert.ok(work.glossary.length >= 2, `${work.slug}: plain words`);
    assert.deepEqual(mapProblems(work.map), [], `${work.slug}: map`);
    assert.ok(work.map.note, `${work.slug}: the map says how it was made`);
  }
});
