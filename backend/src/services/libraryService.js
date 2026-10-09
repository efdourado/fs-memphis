import AppError from './appError.js';
import { summarize } from './catalogLogic.js';

const emptyLibrary = () => ({ savedWorks: [], following: [], questions: [], updatesSeenAt: null });

// What a listener keeps: saved songs, followed people and their own questions.
// Everything here can be exported or deleted by its owner.
export class LibraryService {
  constructor({ userModel, workModel, personModel, sessionModel }) {
    this.userModel = userModel;
    this.workModel = workModel;
    this.personModel = personModel;
    this.sessionModel = sessionModel;
  }

  async rawLibrary(userId) {
    const user = await this.userModel.findById(userId, { library: 1 }).lean();
    if (!user) throw new AppError('User not found', 404);
    return { ...emptyLibrary(), ...(user.library || {}) };
  }

  async getLibrary(userId) {
    const library = await this.rawLibrary(userId);
    const workSlugs = [...new Set([
      ...library.savedWorks.map((w) => w.slug),
      ...library.questions.map((q) => q.workSlug),
    ])];
    const [works, people] = await Promise.all([
      this.workModel.find({ slug: { $in: workSlugs } }).lean(),
      this.personModel.find({ slug: { $in: library.following.map((p) => p.slug) } }).lean(),
    ]);
    const workBySlug = new Map(works.map((w) => [w.slug, w]));
    const personBySlug = new Map(people.map((p) => [p.slug, p]));

    // Other works in the collection credited to the people a listener follows.
    const followed = new Set(library.following.map((p) => p.slug));
    const saved = new Set(library.savedWorks.map((w) => w.slug));
    const fromFollowed = followed.size
      ? (await this.workModel.find({ 'credits.personSlug': { $in: [...followed] } }).sort({ order: 1 }).lean())
        .filter((work) => !saved.has(work.slug))
        .map((work) => ({
          work: summarize(work),
          people: work.credits.filter((c) => followed.has(c.personSlug)).map((c) => ({ slug: c.personSlug, name: c.name }))
            .filter((p, i, list) => list.findIndex((q) => q.slug === p.slug) === i),
        }))
      : [];

    return {
      saved: library.savedWorks
        .filter((w) => workBySlug.has(w.slug))
        .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
        .map((w) => ({ ...summarize(workBySlug.get(w.slug)), savedAt: w.savedAt })),
      following: library.following
        .filter((p) => personBySlug.has(p.slug))
        .map((p) => ({ slug: p.slug, name: personBySlug.get(p.slug).name, followedAt: p.followedAt })),
      questions: library.questions
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((q) => ({
          _id: q._id,
          text: q.text,
          createdAt: q.createdAt,
          work: workBySlug.has(q.workSlug) ? summarize(workBySlug.get(q.workSlug)) : { slug: q.workSlug, title: q.workSlug },
        })),
      fromFollowed,
      updatesSeenAt: library.updatesSeenAt,
    };
  }

  async state(userId) {
    const library = await this.rawLibrary(userId);
    return {
      saved: library.savedWorks.map((w) => w.slug),
      following: library.following.map((p) => p.slug),
    };
  }

  async save(userId, slug) {
    if (!(await this.workModel.exists({ slug }))) throw new AppError('Song not found', 404);
    await this.userModel.updateOne(
      { _id: userId, 'library.savedWorks.slug': { $ne: slug } },
      { $push: { 'library.savedWorks': { slug, savedAt: new Date() } } },
    );
    return this.state(userId);
  }

  async unsave(userId, slug) {
    await this.userModel.updateOne({ _id: userId }, { $pull: { 'library.savedWorks': { slug } } });
    return this.state(userId);
  }

  async follow(userId, slug) {
    if (!(await this.personModel.exists({ slug }))) throw new AppError('Person not found', 404);
    await this.userModel.updateOne(
      { _id: userId, 'library.following.slug': { $ne: slug } },
      { $push: { 'library.following': { slug, followedAt: new Date() } } },
    );
    return this.state(userId);
  }

  async unfollow(userId, slug) {
    await this.userModel.updateOne({ _id: userId }, { $pull: { 'library.following': { slug } } });
    return this.state(userId);
  }

  async addQuestion(userId, { workSlug, text }) {
    const trimmed = String(text || '').trim();
    if (!trimmed) throw new AppError('Write a question first', 400);
    if (trimmed.length > 280) throw new AppError('Keep questions under 280 characters', 400);
    if (!(await this.workModel.exists({ slug: workSlug }))) throw new AppError('Song not found', 404);
    await this.userModel.updateOne(
      { _id: userId },
      { $push: { 'library.questions': { workSlug, text: trimmed, createdAt: new Date() } } },
    );
    return this.getLibrary(userId);
  }

  async removeQuestion(userId, questionId) {
    await this.userModel.updateOne({ _id: userId }, { $pull: { 'library.questions': { _id: questionId } } });
    return this.getLibrary(userId);
  }

  async markUpdatesSeen(userId) {
    const now = new Date();
    await this.userModel.updateOne({ _id: userId }, { $set: { 'library.updatesSeenAt': now } });
    return { updatesSeenAt: now };
  }

  async exportData(userId) {
    const [user, sessions] = await Promise.all([
      this.userModel.findById(userId, { name: 1, email: 1, createdAt: 1, library: 1 }).lean(),
      this.sessionModel.find({ user: userId }).lean(),
    ]);
    if (!user) throw new AppError('User not found', 404);
    return {
      exportedAt: new Date().toISOString(),
      account: { name: user.name, email: user.email, createdAt: user.createdAt },
      library: { ...emptyLibrary(), ...(user.library || {}) },
      listeningJournal: sessions,
    };
  }

  async deleteAccount(userId) {
    await Promise.all([
      this.sessionModel.deleteMany({ user: userId }),
      this.userModel.deleteOne({ _id: userId }),
    ]);
    return { deleted: true };
  }
}
