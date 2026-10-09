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
  facts: { type: [noteSchema], default: [] },
  attention: {
    metric: { type: String, default: '' },
    note: { type: String, default: '' },
    status,
    points: [{ _id: false, period: String, value: Number }],
  },
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
