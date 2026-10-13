import { sessionFor, workFor } from './edition.js';
import { connectionFor, choiceFor, sanitizeDiscoveries } from './connections.js';

export const NOTEBOOK_KEY = 'memphis-listening-notebook-v1';
export const empty = { saved: [], notes: {}, progress: {}, discoveries: [] };
export function sanitizeNotebook(value) {
  if (!value || typeof value !== 'object') return empty;
  return {
    saved: Array.isArray(value.saved) ? [...new Set(value.saved)].filter(id => typeof id === 'string' && /^[a-z0-9-]+:\d+$/.test(id) && workFor(id.split(':')[0])?.tryIt?.[Number(id.split(':')[1])]) : [],
    notes: Object.fromEntries(Object.entries(value.notes || {}).filter(([slug, note]) => sessionFor(slug) && typeof note === 'string').map(([slug, note]) => [slug, note.slice(0, 2000)])),
    progress: Object.fromEntries(Object.entries(value.progress || {}).filter(([slug, step]) => sessionFor(slug) && Number.isInteger(step) && step >= 0 && step <= 3)),
    discoveries: sanitizeDiscoveries(value.discoveries),
  };
}

export function exportNotebook(notebook) {
  const content = ['# My Memphis notebook', ''];
  for (const id of notebook.saved) {
    const [slug, index] = id.split(':');
    const work = workFor(slug);
    const idea = work?.tryIt?.[index];
    if (idea) content.push(`## ${idea.title}`, `From ${work.title}`, idea.body, '');
  }
  for (const [slug, text] of Object.entries(notebook.notes)) {
    const work = workFor(slug);
    if (work && text.trim()) content.push(`## Listening to ${work.title}`, text, '');
  }
  for (const discovery of sanitizeDiscoveries(notebook.discoveries)) {
    const connection = connectionFor(discovery.id);
    const choice = choiceFor(discovery.id, discovery.choiceId);
    content.push(`## ${connection.title}`, `Listening table: ${connection.sides.map(side => sessionFor(side.slug).title).join(' ↔ ')}`, `I chose: ${choice.label}`, choice.takeaway, `Next listen: ${choice.prompt}`);
    if (discovery.note.trim()) content.push(`My reflection: ${discovery.note}`);
    content.push('');
  }
  return content.join('\n');
}
