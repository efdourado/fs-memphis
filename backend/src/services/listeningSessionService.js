import AppError from './appError.js';

const normalizeList = (values) => [...new Set((Array.isArray(values) ? values : [])
  .map((value) => String(value).trim().toLowerCase()).filter(Boolean))].slice(0, 12);

const topEntry = (values) => {
  const counts = values.reduce((result, value) => ({ ...result, [value]: (result[value] || 0) + 1 }), {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || null;
};

const dayPartFor = (dateValue) => {
  const hour = new Date(dateValue).getHours();
  if (hour < 6) return 'late night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

export class ListeningSessionService {
  constructor(sessionDAO, insightDAO) {
    this.sessionDAO = sessionDAO;
    this.insightDAO = insightDAO;
  }

  _sanitize(data) {
    return {
      occurredAt: data.occurredAt || new Date(),
      durationMinutes: Number(data.durationMinutes) || 1,
      source: data.source || 'other',
      activity: String(data.activity || '').trim(),
      moodBefore: normalizeList(data.moodBefore),
      moodAfter: normalizeList(data.moodAfter),
      location: String(data.location || '').trim(),
      socialContext: data.socialContext || '',
      note: String(data.note || '').trim(),
      privacy: 'private',
      reference: {
        title: String(data.reference?.title || '').trim(),
        creator: String(data.reference?.creator || '').trim(),
        url: String(data.reference?.url || '').trim(),
        service: data.reference?.service || '',
        externalId: String(data.reference?.externalId || '').trim(),
      },
    };
  }

  getMine(userId) { return this.sessionDAO.findByUser(userId); }
  getAllForAdmin() { return this.sessionDAO.findAll(); }

  async getOwned(id, user) {
    const session = await this.sessionDAO.findById(id);
    if (!session) throw new AppError('Listening session not found', 404);
    if (!user.isAdmin && session.user.toString() !== user._id.toString()) {
      throw new AppError('Listening session is private', 403);
    }
    return session;
  }

  create(userId, data) { return this.sessionDAO.create({ ...this._sanitize(data), user: userId }); }

  async update(id, user, data) {
    await this.getOwned(id, user);
    return this.sessionDAO.updateById(id, this._sanitize(data));
  }

  async delete(id, user) {
    await this.getOwned(id, user);
    return this.sessionDAO.deleteById(id);
  }

  async getReferences(userId) {
    const sessions = await this.sessionDAO.findByUser(userId);
    const seen = new Set();
    return sessions.map((session) => session.reference).filter((reference) => {
      if (!reference || (!reference.title && !reference.url)) return false;
      const key = reference.externalId || reference.url || `${reference.title}:${reference.creator}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async getInsights(userId) {
    const sessions = await this.sessionDAO.findByUser(userId);
    if (sessions.length === 0) return [];

    const totalMinutes = sessions.reduce((sum, session) => sum + (session.durationMinutes || 0), 0);
    const activity = topEntry(sessions.map((session) => session.activity).filter(Boolean));
    const moodBefore = topEntry(sessions.flatMap((session) => session.moodBefore || []));
    const moodAfter = topEntry(sessions.flatMap((session) => session.moodAfter || []));
    const sources = topEntry(sessions.map((session) => session.source).filter(Boolean));
    const time = topEntry(sessions.map((session) => dayPartFor(session.occurredAt)));
    const insights = [
      {
        type: 'volume',
        summary: `${sessions.length} listening moments, ${totalMinutes} intentional minutes.`,
        evidence: { sessionCount: sessions.length, totalMinutes },
      },
      activity && {
        type: 'activity',
        summary: `${activity[0]} is your most recorded listening context.`,
        evidence: { activity: activity[0], count: activity[1] },
      },
      (moodBefore || moodAfter) && {
        type: 'mood',
        summary: `Your clearest mood path is ${moodBefore?.[0] || 'unrecorded'} → ${moodAfter?.[0] || 'unrecorded'}.`,
        evidence: { before: moodBefore, after: moodAfter },
      },
      sources && {
        type: 'source',
        summary: `${sources[0]} is your most recorded listening source.`,
        evidence: { source: sources[0], count: sources[1] },
      },
      time && {
        type: 'time',
        summary: `${time[0]} is when you record listening most often.`,
        evidence: { dayPart: time[0], count: time[1] },
      },
    ].filter(Boolean);

    return this.insightDAO.replaceForUser(userId, insights);
  }
}
