// Pure functions behind the song experience. Nothing here touches the database,
// so every computed claim Memphis shows can be tested and explained.

const monthIndex = (period) => {
  const [year, month] = period.split('-').map(Number);
  return year * 12 + (month - 1);
};

const periodFromIndex = (index) => {
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
};

// Turns a few anchor points into a monthly series by linear interpolation.
// Used only for demo timelines, which the interface labels as such.
export function buildSeries(anchors) {
  const sorted = [...anchors].sort((a, b) => monthIndex(a[0]) - monthIndex(b[0]));
  const points = [];
  for (let i = 0; i < sorted.length - 1; i += 1) {
    const [fromPeriod, fromValue] = sorted[i];
    const [toPeriod, toValue] = sorted[i + 1];
    const start = monthIndex(fromPeriod);
    const span = monthIndex(toPeriod) - start;
    for (let step = 0; step < span; step += 1) {
      const value = fromValue + ((toValue - fromValue) * step) / span;
      points.push({ period: periodFromIndex(start + step), value: Math.round(value) });
    }
  }
  const [lastPeriod, lastValue] = sorted.at(-1);
  points.push({ period: lastPeriod, value: lastValue });
  return points;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthLabel = (period) => `${MONTHS[Number(period.slice(5, 7)) - 1]} ${period.slice(0, 4)}`;

const average = (values) => (values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0);

// Separates sustained growth, a short spike and renewed attention to an older
// recording, using only the series itself and the release year.
export function readAttention(points = [], released = '') {
  if (points.length < 6) {
    return { pattern: 'insufficient', label: 'Not enough data yet', explanation: 'We need at least six points to call a pattern.' };
  }

  const values = points.map((p) => p.value);
  const peakValue = Math.max(...values);
  const peakIndex = values.indexOf(peakValue);
  const peak = points[peakIndex];
  const baseline = average(values.slice(0, 3));
  const latest = average(values.slice(-3));
  const releaseYear = Number(String(released).slice(0, 4));
  const peakYear = Number(peak.period.slice(0, 4));
  const yearsBetween = releaseYear ? peakYear - releaseYear : 0;
  const retained = peakValue ? latest / peakValue : 0;

  const facts = {
    peak,
    baseline: Math.round(baseline),
    latest: Math.round(latest),
    retainedShare: Math.round(retained * 100),
    yearsFromReleaseToPeak: yearsBetween,
  };

  if (yearsBetween >= 10 && peakValue >= baseline * 2) {
    return {
      pattern: 'renewed',
      label: 'Comeback',
      explanation: `Peaked ${yearsBetween} years after release, far above where it started.`,
      ...facts,
    };
  }

  // A share of a peak only means something when the peak rose from a lower
  // level; a series that starts at its highest point is new, not retained.
  const sustainedShare = peakIndex > 0 ? 0.6 : 2;
  if (retained >= sustainedShare) {
    return {
      pattern: 'sustained',
      label: 'Built to last',
      explanation: `Still holding ${Math.round(retained * 100)}% of its peak.`,
      ...facts,
    };
  }

  if (retained < 0.35 && peakIndex < points.length - 3) {
    return {
      pattern: 'spike',
      label: 'Quick spike',
      explanation: `Peaked in ${monthLabel(peak.period)}. Now at ${Math.round(retained * 100)}% of that.`,
      ...facts,
    };
  }

  return {
    pattern: 'settling',
    label: 'Cooling off',
    explanation: `Peaked in ${monthLabel(peak.period)}, then settled at ${Math.round(retained * 100)}% of that.`,
    ...facts,
  };
}

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
    question: work.question || '',
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
    attention: {
      a: { points: a.attention?.points || [], status: a.attention?.status, reading: readAttention(a.attention?.points, a.released) },
      b: { points: b.attention?.points || [], status: b.attention?.status, reading: readAttention(b.attention?.points, b.released) },
    },
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
