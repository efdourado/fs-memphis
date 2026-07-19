import mongoose from 'mongoose';

const externalReferenceSchema = new mongoose.Schema({
  title: { type: String, trim: true, default: '' },
  creator: { type: String, trim: true, default: '' },
  url: { type: String, trim: true, default: '' },
  service: {
    type: String,
    enum: ['', 'spotify', 'youtube', 'bandcamp', 'soundcloud', 'vinyl', 'radio', 'live', 'other'],
    default: '',
  },
  externalId: { type: String, trim: true, default: '' },
}, { _id: false });

const listeningSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  occurredAt: { type: Date, required: true, default: Date.now, index: true },
  durationMinutes: { type: Number, min: 1, max: 1440, default: 1 },
  source: {
    type: String,
    enum: ['spotify', 'youtube', 'bandcamp', 'soundcloud', 'vinyl', 'radio', 'live', 'other'],
    default: 'other',
  },
  activity: { type: String, trim: true, maxlength: 80, default: '' },
  moodBefore: { type: [String], default: [] },
  moodAfter: { type: [String], default: [] },
  location: { type: String, trim: true, maxlength: 120, default: '' },
  socialContext: {
    type: String,
    enum: ['', 'alone', 'friends', 'family', 'partner', 'crowd', 'other'],
    default: '',
  },
  note: { type: String, trim: true, maxlength: 2000, default: '' },
  privacy: { type: String, enum: ['private'], default: 'private' },
  reference: { type: externalReferenceSchema, default: () => ({}) },
}, { timestamps: true });

listeningSessionSchema.index({ user: 1, occurredAt: -1 });

export default mongoose.model('ListeningSession', listeningSessionSchema);
