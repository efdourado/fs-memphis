import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverImage: { type: String, default: '' },
  releaseDate: { type: Date, required: true },
  genre: { type: [String], required: true },
  type: {
    type: String,
    enum: ['album', 'single', 'ep', 'compilation'],
    default: 'album'
  },
  totalPlays: { type: Number, default: 0 },
  isExplicit: { type: Boolean, default: false },
  copyright: { type: String, default: '' },

  concept: { type: String, default: '' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],

  label: { type: String, default: '' }
}, { timestamps: true });

const Album = mongoose.model('Album', albumSchema);

export default Album;