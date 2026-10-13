import catalog from './catalog.json' with { type: 'json' };

export const sessions = [
  {
    slug: 'dreams', title: 'Dreams', artist: 'Fleetwood Mac', year: '1977', duration: '4:14', color: '#d1b47d',
    idea: 'Move without moving.', category: 'Repetition', subtitle: 'Same foundation. A different room every time.',
    invitation: 'What if a song could go somewhere without changing its chords?',
    focus: 'Follow the drums through a verse and a chorus. Let the voice fall into the background for a moment.',
    question: 'What makes the chorus feel bigger?', options: ['The foundation changes', 'The space around it changes', 'Everything gets faster'], answer: 1,
    reveal: 'Our reading: the foundation stays steady while guitars and harmonies open up the space. Movement can come from the arrangement itself.',
    sections: [1, 3, 8], next: 'running-up-that-hill', bridge: 'A steady pulse can feel peaceful. Can it also feel restless?',
  },
  {
    slug: 'bad-guy', title: 'bad guy', artist: 'Billie Eilish', year: '2019', duration: '3:14', color: '#b7c493',
    idea: 'Make less feel like more.', category: 'Negative space', subtitle: 'The empty space is doing half the work.',
    invitation: 'How much can you take away before a song loses its power?',
    focus: 'Listen to the first instrumental hook. Notice what happens to the voice when the riff takes over.',
    question: 'What takes the spotlight in the hook?', options: ['A wall of backing vocals', 'An instrumental riff', 'A guitar solo'], answer: 1,
    reveal: 'Our reading: the riff takes the role you might expect a sung chorus to play. Leaving room makes a small sound feel like the main event.',
    sections: [1, 3, 7], next: 'dreams', bridge: 'Two very different songs. One shared instinct: give each part room.',
  },
  {
    slug: 'running-up-that-hill', title: 'Running Up That Hill', artist: 'Kate Bush', year: '1985', duration: '4:58', color: '#c4afd4',
    idea: 'Hold on to the tension.', category: 'Tension', subtitle: 'A machine keeps running. The humans break through.',
    invitation: 'What happens when the rhythm refuses to let go?',
    focus: 'Follow the repeating rhythm toward the ending. Listen for the contrast when the final fills arrive.',
    question: 'What gives the ending a different energy?', options: ['The rhythm disappears', 'The voice disappears', 'Played accents over the repeating pulse'], answer: 2,
    reveal: 'Our reading: the repeating machine rhythm sets an expectation. The played fills and guitar at the end feel expressive against that steady frame.',
    sections: [0, 4, 7], next: 'bad-guy', bridge: 'Kate holds the pulse. Billie changes it. Explore another way to make an ending land.',
  },
];
export const sessionFor = slug => sessions.find(session => session.slug === slug);
export const workFor = slug => catalog.works.find(work => work.slug === slug);
const missing = () => Promise.reject({ response: { status: 404, data: { message: 'This page is not in the collection.' } } });
export const editionApi = {
  publicUpdates: async () => ({ items: catalog.updates.map(update => ({ ...update, relevant: false, reasons: [], isNew: false })), unseen: 0 }),
  works: async () => catalog.works,
  work: slug => workFor(slug) ? Promise.resolve(workFor(slug)) : missing(),
  people: async () => catalog.people.map(person => ({ ...person, songs: person.credits.length, roles: [...new Set(person.credits.flatMap(c => c.roles))] })),
  person: slug => { const person = catalog.people.find(p => p.slug === slug); return person ? Promise.resolve(person) : missing(); },
  search: async query => {
    if (!String(query || '').trim()) return { works: [], people: [] };
    const contains = value => String(value || '').toLowerCase().includes(query.trim().toLowerCase());
    return {
      works: catalog.works.filter(work => [work.title, work.artist, work.album, work.hook, ...(work.genres || []), ...work.credits.map(c => c.name)].some(contains)),
      people: catalog.people.filter(person => [person.name, ...person.alsoKnownAs].some(contains)),
    };
  },
  compare: (a, b) => {
    if (!a || !b || a === b) return Promise.reject({ response: { status: 400, data: { message: 'Choose two different songs.' } } });
    const left = workFor(a), right = workFor(b);
    if (!left || !right) return missing();
    const labels = [...new Set([...left.dimensions, ...right.dimensions].map(d => d.label))];
    return Promise.resolve({ a: left, b: right, dimensions: labels.map(label => ({ label, a: left.dimensions.find(d => d.label === label) || null, b: right.dimensions.find(d => d.label === label) || null })), sharedPeople: left.credits.filter(c => right.credits.some(p => p.personSlug === c.personSlug)).map(c => ({ slug: c.personSlug, name: c.name })) });
  },
};
