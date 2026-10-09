import AppError from './appError.js';
import {
  collaboratorsOf,
  compareWorks,
  connectionsFor,
  creditsForPerson,
  markUpdates,
  readAttention,
  searchCatalog,
  summarize,
} from './catalogLogic.js';

// The collection is small and curated, so it is read whole and computed in memory.
export class CatalogService {
  constructor({ workModel, personModel, updateModel }) {
    this.workModel = workModel;
    this.personModel = personModel;
    this.updateModel = updateModel;
  }

  allWorks() {
    return this.workModel.find().sort({ order: 1 }).lean();
  }

  allPeople() {
    return this.personModel.find().sort({ name: 1 }).lean();
  }

  async listWorks() {
    const works = await this.allWorks();
    return works.map((work) => ({
      ...summarize(work),
      attention: { status: work.attention?.status, reading: readAttention(work.attention?.points, work.released) },
    }));
  }

  async getWork(slug) {
    const works = await this.allWorks();
    const work = works.find((w) => w.slug === slug);
    if (!work) throw new AppError('Song not found', 404);
    const { _id, __v, createdAt, ...rest } = work;
    return {
      ...rest,
      reading: readAttention(work.attention?.points, work.released),
      connectionsResolved: connectionsFor(work, works),
      compareSuggestions: (work.compareWith || [])
        .map((other) => works.find((w) => w.slug === other))
        .filter(Boolean)
        .map(summarize),
    };
  }

  async getPerson(slug) {
    const [person, works] = await Promise.all([
      this.personModel.findOne({ slug }).lean(),
      this.allWorks(),
    ]);
    if (!person) throw new AppError('Person not found', 404);
    return {
      slug: person.slug,
      name: person.name,
      alsoKnownAs: person.alsoKnownAs || [],
      credits: creditsForPerson(slug, works),
      collaborators: collaboratorsOf(slug, works),
    };
  }

  async compare(a, b) {
    if (!a || !b) throw new AppError('Choose two songs to compare', 400);
    if (a === b) throw new AppError('Choose two different songs', 400);
    const works = await this.allWorks();
    const left = works.find((w) => w.slug === a);
    const right = works.find((w) => w.slug === b);
    if (!left || !right) throw new AppError('Song not found', 404);
    return compareWorks(left, right);
  }

  async search(query) {
    const [works, people] = await Promise.all([this.allWorks(), this.allPeople()]);
    return searchCatalog(query, works, people);
  }

  async updates(library) {
    const updates = await this.updateModel.find().sort({ date: -1 }).limit(50).lean();
    const clean = updates.map(({ _id, __v, createdAt, updatedAt, ...rest }) => rest);
    return markUpdates(clean, library);
  }

  async peopleBySlugs(slugs) {
    if (!slugs.length) return [];
    return this.personModel.find({ slug: { $in: slugs } }, { slug: 1, name: 1, _id: 0 }).lean();
  }
}

// Writes the curated collection to the database so the repository stays the
// reviewed source of truth. Works and people removed from the files are removed here.
export async function syncCatalog({ workModel, personModel, updateModel }, { works, people, updates }) {
  const upsert = (model, key, docs) => model.bulkWrite(docs.map((doc) => ({
    replaceOne: { filter: { [key]: doc[key] }, replacement: doc, upsert: true },
  })));

  await upsert(workModel, 'slug', works);
  await upsert(personModel, 'slug', people);
  await upsert(updateModel, 'key', updates.map((u) => ({ ...u, date: new Date(u.date) })));

  await workModel.deleteMany({ slug: { $nin: works.map((w) => w.slug) } });
  await personModel.deleteMany({ slug: { $nin: people.map((p) => p.slug) } });
  await updateModel.deleteMany({ key: { $nin: updates.map((u) => u.key) } });

  return { works: works.length, people: people.length, updates: updates.length };
}
