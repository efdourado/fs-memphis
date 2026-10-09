import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSeries,
  collaboratorsOf,
  compareWorks,
  connectionsFor,
  creditsForPerson,
  markUpdates,
  readAttention,
  searchCatalog,
  sharedPeople,
} from './catalogLogic.js';
import { people, updates, works } from '../data/catalog.js';
import { STATUSES } from '../persistence/models/workModel.js';

const bySlug = (slug) => works.find((w) => w.slug === slug);

test('buildSeries interpolates monthly between anchors', () => {
  const series = buildSeries([['2020-01', 0], ['2020-05', 40]]);
  assert.deepEqual(series.map((p) => p.period), ['2020-01', '2020-02', '2020-03', '2020-04', '2020-05']);
  assert.deepEqual(series.map((p) => p.value), [0, 10, 20, 30, 40]);
});

test('buildSeries crosses year boundaries', () => {
  const series = buildSeries([['2019-11', 0], ['2020-02', 30]]);
  assert.deepEqual(series.map((p) => p.period), ['2019-11', '2019-12', '2020-01', '2020-02']);
});

test('readAttention separates renewed, sustained and spike patterns', () => {
  assert.equal(readAttention(bySlug('running-up-that-hill').attention.points, '1985-08-05').pattern, 'renewed');
  assert.equal(readAttention(bySlug('dreams').attention.points, '1977-03-24').pattern, 'renewed');
  assert.equal(readAttention(bySlug('birds-of-a-feather').attention.points, '2024-05-17').pattern, 'sustained');
  assert.equal(readAttention(bySlug('die-young').attention.points, '2012-09-25').pattern, 'spike');
});

test('readAttention refuses to describe too little data', () => {
  assert.equal(readAttention([{ period: '2020-01', value: 3 }], '2020').pattern, 'insufficient');
});

test('a series that starts at its peak is not called sustained', () => {
  const points = buildSeries([['2020-01', 100], ['2020-12', 70]]);
  assert.notEqual(readAttention(points, '2020-01-01').pattern, 'sustained');
});

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

test('searchCatalog matches titles, artists and alternative names', () => {
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

test('catalog data is internally consistent', () => {
  const personSlugs = new Set(people.map((p) => p.slug));
  const workSlugs = new Set(works.map((w) => w.slug));
  assert.equal(workSlugs.size, works.length);

  for (const work of works) {
    const sourceIds = new Set(work.sources.map((s) => s.id));
    const claims = [...work.facts, ...work.events, ...work.guide, ...work.observations, ...work.dimensions, ...work.credits];
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
    assert.equal(work.attention.status, 'demo', `${work.slug}: attention must stay labeled demo until sourced`);
  }

  for (const update of updates) {
    for (const slug of update.workSlugs) assert.ok(workSlugs.has(slug), `update ${update.key}: unknown work`);
    for (const slug of update.personSlugs) assert.ok(personSlugs.has(slug), `update ${update.key}: unknown person`);
  }
});
