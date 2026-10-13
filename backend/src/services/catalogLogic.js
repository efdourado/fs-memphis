// Pure functions behind the song pages. Nothing here touches the database,
// so every computed claim Memphis shows can be tested and explained.

const creditedSlugs = (work) => new Set((work.credits || []).map((c) => c.personSlug));

// Explicitly credited people two works share. A shared credit says who worked
// on both, not that they sound alike.
export function sharedPeople(a, b) {
  const inB = creditedSlugs(b);
  const seen = new Set();
  return (a.credits || [])
    .filter((credit) => inB.has(credit.personSlug) && !seen.has(credit.personSlug) && seen.add(credit.personSlug))
    .map((credit) => ({ slug: credit.personSlug, name: credit.name }));
}

const listNames = (people) => {
  const names = people.map((p) => p.name);
  if (names.length <= 2) return names.join(' and ');
  return `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
};

// Curated connections first, then works that share a credited person.
export function connectionsFor(work, allWorks) {
  const bySlug = new Map(allWorks.map((w) => [w.slug, w]));
  const results = [];
  const included = new Set([work.slug]);

  for (const connection of work.connections || []) {
    const target = bySlug.get(connection.workSlug);
    if (!target || included.has(target.slug)) continue;
    included.add(target.slug);
    results.push({ work: summarize(target), reason: connection.reason, status: connection.status, people: sharedPeople(work, target) });
  }

  for (const other of allWorks) {
    if (included.has(other.slug)) continue;
    const people = sharedPeople(work, other);
    if (!people.length) continue;
    included.add(other.slug);
    results.push({
      work: summarize(other),
      reason: `Both credit ${listNames(people)}.`,
      status: 'computed',
      people,
    });
  }

  return results;
}

export function summarize(work) {
  return {
    slug: work.slug,
    title: work.title,
    artist: work.artist,
    released: work.released,
    album: work.album,
    genres: work.genres || [],
    summary: work.summary,
    hook: work.hook || '',
    idea: work.idea || '',
    depth: work.depth || 'short',
    room: work.room || 'known',
  };
}

// Places two works side by side on the same reviewed dimensions. Dimensions
// missing from either work stay visibly missing.
export function compareWorks(a, b) {
  const labels = [...new Set([...(a.dimensions || []), ...(b.dimensions || [])].map((d) => d.label))];
  const find = (work, label) => (work.dimensions || []).find((d) => d.label === label) || null;
  return {
    a: summarize(a),
    b: summarize(b),
    sharedPeople: sharedPeople(a, b),
    dimensions: labels.map((label) => ({ label, a: find(a, label), b: find(b, label) })),
  };
}

// Which updates matter to a listener: those about saved works or followed people.
export function markUpdates(updates, library = {}) {
  const saved = new Set((library.savedWorks || []).map((w) => w.slug));
  const following = new Set((library.following || []).map((p) => p.slug));
  const seenAt = library.updatesSeenAt ? new Date(library.updatesSeenAt).getTime() : 0;

  const items = updates.map((update) => {
    const reasons = [
      ...(update.workSlugs || []).filter((slug) => saved.has(slug)).map((slug) => ({ type: 'saved', slug })),
      ...(update.personSlugs || []).filter((slug) => following.has(slug)).map((slug) => ({ type: 'following', slug })),
    ];
    const relevant = reasons.length > 0;
    return { ...update, relevant, reasons, isNew: relevant && new Date(update.date).getTime() > seenAt };
  });

  return { items, unseen: items.filter((item) => item.isNew).length };
}

const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function searchCatalog(query, works, people) {
  const trimmed = String(query || '').trim();
  if (!trimmed) return { works: [], people: [] };
  const pattern = new RegExp(escapeRegex(trimmed), 'i');
  return {
    works: works
      .filter((w) => [w.title, w.artist, w.album, ...(w.genres || []), ...(w.credits || []).map((c) => c.name)]
        .some((field) => pattern.test(field || '')))
      .map(summarize),
    people: people
      .filter((p) => [p.name, ...(p.alsoKnownAs || [])].some((field) => pattern.test(field)))
      .map((p) => ({ slug: p.slug, name: p.name })),
  };
}

// A person's page is computed from credits: Memphis does not write biographies
// it cannot source.
export function creditsForPerson(slug, works) {
  return works
    .map((work) => {
      const roles = (work.credits || []).filter((c) => c.personSlug === slug).flatMap((c) => c.roles);
      return roles.length ? { work: summarize(work), roles: [...new Set(roles)] } : null;
    })
    .filter(Boolean);
}

export function collaboratorsOf(slug, works) {
  const counts = new Map();
  for (const work of works) {
    if (!(work.credits || []).some((c) => c.personSlug === slug)) continue;
    const seen = new Set();
    for (const credit of work.credits) {
      if (credit.personSlug === slug || seen.has(credit.personSlug)) continue;
      seen.add(credit.personSlug);
      const entry = counts.get(credit.personSlug) || { slug: credit.personSlug, name: credit.name, works: [] };
      entry.works.push(work.title);
      counts.set(credit.personSlug, entry);
    }
  }
  return [...counts.values()].sort((a, b) => b.works.length - a.works.length || a.name.localeCompare(b.name));
}

// An arrangement map is a grid: one row per layer, one cell per section.
// Cell values: 0 silent, 1 quiet, 2 playing, 3 present but placement unknown.
export const MAP_CELLS = [0, 1, 2, 3];

export function mapProblems(map) {
  if (!map) return [];
  const problems = [];
  const width = (map.sections || []).length;
  if (!width) problems.push('map has no sections');
  for (const layer of map.layers || []) {
    if ((layer.cells || []).length !== width) problems.push(`${layer.name}: ${layer.cells?.length} cells for ${width} sections`);
    if ((layer.cells || []).some((cell) => !MAP_CELLS.includes(cell))) problems.push(`${layer.name}: unknown cell value`);
  }
  return problems;
}

// What a visitor sends to propose a song for the Unheard room.
export function cleanSubmission(input = {}) {
  const text = (value, max) => String(value ?? '').trim().slice(0, max);
  const submission = {
    artist: text(input.artist, 120),
    title: text(input.title, 160),
    link: text(input.link, 300),
    contact: text(input.contact, 160),
    story: text(input.story, 4000),
  };
  const errors = [];
  if (!submission.artist) errors.push('Tell us who made it.');
  if (!submission.title) errors.push('Give the song a title.');
  if (!/^https?:\/\/\S+\.\S+/.test(submission.link)) errors.push('Add a link where we can hear it.');
  if (submission.story.length < 80) errors.push('Tell us how you made it, in a few sentences.');
  return { submission, errors };
}
