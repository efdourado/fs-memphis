import mongoose from 'mongoose';

// A development worth returning for: new context, a new listening note,
// another work by a collaborator or a new comparison. Updates describe
// what changed in Memphis, never invented outside news.
const updateSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  date: { type: Date, required: true, index: true },
  kind: { type: String, enum: ['context', 'listening', 'collection', 'comparison'], required: true },
  title: { type: String, required: true },
  body: { type: String, default: '' },
  workSlugs: { type: [String], default: [] },
  personSlugs: { type: [String], default: [] },
  link: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Update', updateSchema);
