import test from 'node:test';
import assert from 'node:assert/strict';
import { ListeningSessionService } from './listeningSessionService.js';

const sessions = [{
  _id: 'session-1',
  user: 'user-1',
  occurredAt: new Date('2026-07-19T20:00:00'),
  durationMinutes: 30,
  activity: 'focus',
  source: 'vinyl',
  moodBefore: ['tired'],
  moodAfter: ['calm'],
  reference: { title: 'Reference', url: 'https://example.com' },
}];

const createService = () => new ListeningSessionService({
  findByUser: async () => sessions,
  findById: async () => sessions[0],
  create: async (data) => data,
  updateById: async (id, data) => ({ _id: id, ...data }),
  deleteById: async () => true,
  findAll: async () => sessions,
}, {
  replaceForUser: async (userId, insights) => insights,
});

test('keeps private sessions owned by their user', async () => {
  const service = createService();
  await assert.rejects(
    service.getOwned('session-1', { _id: 'user-2', isAdmin: false }),
    (error) => error.statusCode === 403,
  );
  assert.equal((await service.getOwned('session-1', { _id: 'user-1', isAdmin: false }))._id, 'session-1');
});

test('creates explainable volume, activity, mood, source and time insights', async () => {
  const insights = await createService().getInsights('user-1');
  assert.deepEqual(insights.map((insight) => insight.type), ['volume', 'activity', 'mood', 'source', 'time']);
  assert.equal(insights[0].evidence.totalMinutes, 30);
});

test('deduplicates external references', async () => {
  const references = await createService().getReferences('user-1');
  assert.equal(references.length, 1);
  assert.equal(references[0].title, 'Reference');
});
