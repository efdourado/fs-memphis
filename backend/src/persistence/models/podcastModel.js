import mongoose from 'mongoose';
const { Schema } = mongoose;

const PodcastSchema = new Schema({
  title: { type: String, required: true },
  episodeTitle: { type: String },
  showNotes: { type: String },
  audioUrl: { type: String, required: true },
  coverImage: { url: String, alt: String },
  
  externalLinks: {
    spotify: String,
    apple: String,
    youtube: String,
    website: String
  },
  
  topics: [String],
  relatedTracks: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
  relatedArtists: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Podcast = mongoose.model('Podcast', PodcastSchema);
export default Podcast;