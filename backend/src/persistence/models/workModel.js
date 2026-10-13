import mongoose from 'mongoose';

// Every claim in a work carries a status so the interface can say what it is:
// verified (named source), editorial (Memphis reading), computed (visible method),
// demo (illustrative data) or awaiting (a deliberate gap).
const STATUSES = ['verified', 'editorial', 'computed', 'demo', 'awaiting'];
const status = { type: String, enum: STATUSES, required: true };

const sourceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  publisher: { type: String, default: '' },
  url: { type: String, default: '' },
  accessed: { type: String, default: '' },
}, { _id: false });

const eventSchema = new mongoose.Schema({
  date: { type: String, required: true },
  kind: { type: String, enum: ['release', 'chart', 'screen', 'social', 'award', 'performance', 'news'], required: true },
  title: { type: String, required: true },
  body: { type: String, default: '' },
  status,
  sourceId: { type: String, default: '' },
}, { _id: false });

const noteSchema = new mongoose.Schema({
  label: { type: String, required: true },
  body: { type: String, required: true },
  status,
  sourceId: { type: String, default: '' },
}, { _id: false });

const creditSchema = new mongoose.Schema({
  personSlug: { type: String, required: true },
  name: { type: String, required: true },
  roles: { type: [String], default: [] },
  status,
  sourceId: { type: String, default: '' },
}, { _id: false });

const workSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  artistSlugs: { type: [String], default: [] },
  released: { type: String, required: true },
  album: { type: String, default: '' },
  label: { type: String, default: '' },
  genres: { type: [String], default: [] },
  summary: { type: String, required: true },
  question: { type: String, default: '' },
  // "known" songs are documented hits; "unheard" songs are chosen for craft and show no numbers.
  room: { type: String, enum: ['known', 'unheard'], default: 'known' },
  // A "full" page has the making-of, the map and things to try; a "short" one is still being researched.
  depth: { type: String, enum: ['full', 'short'], default: 'short' },
  hook: { type: String, default: '' },
  idea: { type: String, default: '' },
  figures: [{ _id: false, value: String, label: String, status, sourceId: { type: String, default: '' } }],
  making: { type: [noteSchema], default: [] },
  glossary: [{ _id: false, term: String, body: String }],
  map: {
    sections: { type: [String], default: undefined },
    layers: { type: [{ _id: false, name: String, status, cells: [Number] }], default: undefined },
    note: { type: String, default: undefined },
  },
  moments: { type: [noteSchema], default: [] },
  why: { type: [String], default: [] },
  tryIt: [{ _id: false, title: String, body: String }],
  versions: { type: [noteSchema], default: [] },
  recorded: { type: String, default: '' },
  facts: { type: [noteSchema], default: [] },
  events: { type: [eventSchema], default: [] },
  guide: { type: [noteSchema], default: [] },
  observations: { type: [noteSchema], default: [] },
  dimensions: { type: [noteSchema], default: [] },
  credits: { type: [creditSchema], default: [] },
  connections: [{
    _id: false,
    workSlug: { type: String, required: true },
    reason: { type: String, required: true },
    status,
  }],
  compareWith: { type: [String], default: [] },
  listen: [{ _id: false, service: String, url: String }],
  sources: { type: [sourceSchema], default: [] },
  order: { type: Number, default: 0 },
}, { timestamps: true });

workSchema.index({ title: 'text', artist: 'text', album: 'text', genres: 'text' });

export { STATUSES };
export default mongoose.model('Work', workSchema);
