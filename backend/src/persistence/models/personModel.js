import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  alsoKnownAs: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model('Person', personSchema);
