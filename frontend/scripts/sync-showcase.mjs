// Build a browser-readable edition from the reviewed catalog; no database needed.
import { access, readFile, writeFile, mkdir } from 'node:fs/promises';
// Standalone frontend containers use the checked-in edition. A repository build
// regenerates it from the reviewed catalog and fails on malformed source data.
try {
  await access(new URL('../../backend/src/data/catalog.js', import.meta.url));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  const snapshot = JSON.parse(await readFile(new URL('../src/product/listening/catalog.json', import.meta.url), 'utf8'));
  if (!snapshot.works?.length || !snapshot.people?.length) throw new Error('The bundled catalog is empty.');
  for (const work of snapshot.works) await access(new URL(`../public/covers/${work.slug}.svg`, import.meta.url));
  console.log('Using the checked-in public edition (standalone frontend checkout).');
  process.exit(0);
}
const { works, people } = await import('../../backend/src/data/catalog.js');
const { connectionsFor, creditsForPerson, collaboratorsOf, summarize } = await import('../../backend/src/services/catalogLogic.js');
const { createPrototypeCover } = await import('../../backend/src/controllers/prototypeMediaController.js');
const edition = {
  works: works.map(work => ({ ...work, artistSlugs: work.artistSlugs || [], events: work.events || [], guide: work.guide || [], observations: work.observations || [], connectionsResolved: connectionsFor(work, works), compareSuggestions: (work.compareWith || []).map(slug => works.find(w => w.slug === slug)).filter(Boolean).map(summarize) })),
  people: people.map(person => ({ ...person, alsoKnownAs: person.alsoKnownAs || [], credits: creditsForPerson(person.slug, works), collaborators: collaboratorsOf(person.slug, works) })),
};
await writeFile(new URL('../src/product/listening/catalog.json', import.meta.url), JSON.stringify(edition));
await mkdir(new URL('../public/covers/', import.meta.url), { recursive: true });
for (const work of works) {
  await writeFile(new URL(`../public/covers/${work.slug}.svg`, import.meta.url), createPrototypeCover(work.slug).replace('PROTOTYPE AUDIO', 'LISTEN CLOSER').replace('Memphis prototype artwork', 'Memphis original artwork'));
}
console.log(`Packaged ${works.length} songs and ${people.length} people for the browser.`);
