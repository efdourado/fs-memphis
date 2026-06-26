import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  subtitle: { type: String, default: "" },
  description: { type: String, default: "" },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
  durationMs: { type: Number, required: true },
  audioUrl: { type: String },
  coverImage: { type: String, default: "" },
  previewStartMs: { type: Number, min: 0 },
  waveformUrl: { type: String, default: "" },
  isExplicit: { type: Boolean, default: false },
  language: { type: String, default: "" },
  isrc: { type: String, default: "", trim: true, uppercase: true, index: true },
  copyright: { type: String, default: "" },
  lyrics: { type: String, default: "" },
  plays: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  releaseDate: { type: Date },

  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],

  genres: { type: [String], default: [] },
  emotions: { type: [String], default: [] },
  instruments: { type: [String], default: [] },

  structure: [{
    part: String,
    startMs: Number,
    endMs: Number
  }],
  analysis: {
    bpm: Number,
    key: String,
    mode: Number,
    energy: Number,
    danceability: Number,
    acousticness: Number,
    valence: Number,
    loudness: Number,
    instrumentalness: Number,
    speechiness: Number,
    liveness: Number,
    timeSignature: String,
    keyConfidence: Number,
    tempoConfidence: Number,
    complexity: Number,
    groove: Number
  },
  activityProfiles: {
    focus: { type: Number, min: 0, max: 1 },
    study: { type: Number, min: 0, max: 1 },
    workout: { type: Number, min: 0, max: 1 },
    party: { type: Number, min: 0, max: 1 },
    relaxation: { type: Number, min: 0, max: 1 },
    creativity: { type: Number, min: 0, max: 1 }
  },
  audioQuality: {
    codec: { type: String, default: "" },
    bitrateKbps: Number,
    sampleRateHz: Number,
    lossless: { type: Boolean, default: false },
    fileSizeBytes: Number
  },

  editorial: {
    story: String,
    productionNotes: String,
    notableSamples: [String],
    listeningGuide: [{
      title: String,
      body: String,
      startMs: Number,
      endMs: Number
    }]
  },
  education: {
    theoryNotes: String,
    arrangementNotes: String,
    productionBreakdown: String,
    difficulty: {
      type: String,
      enum: ["", "beginner", "intermediate", "advanced"],
      default: ""
    },
    techniques: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    inspiration: { type: [String], default: [] }
  },
  credits: {
    writers: [String],
    producers: [String],
    mastering: [String],
    mixing: [String],
    engineers: [String],
    musicians: [String],
    studio: String,
    label: String
  },

  externalLinks: {
    spotify: String,
    youtube: String,
    soundcloud: String,
    genius: String,
    bandcamp: String,
    website: String
  },
  sharing: {
    slug: { type: String, default: "", trim: true, lowercase: true, index: true },
    allowSharing: { type: Boolean, default: true },
    canonicalUrl: { type: String, default: "" }
  }

}, { timestamps: true });

songSchema.index({
  title: "text",
  subtitle: "text",
  description: "text",
  lyrics: "text",
  genres: "text",
  emotions: "text",
  instruments: "text",
  "editorial.story": "text",
  "editorial.productionNotes": "text",
  "education.theoryNotes": "text",
  "education.productionBreakdown": "text"
});
songSchema.index({ artist: 1, releaseDate: -1 });
songSchema.index({ plays: -1, createdAt: -1 });
songSchema.index({ genres: 1 });
songSchema.index({ emotions: 1 });

songSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const songId = doc._id;
    const Album = mongoose.model('Album');
    const Playlist = mongoose.model('Playlist');
    const User = mongoose.model('User');

    await Album.updateMany({ songs: songId }, { $pull: { songs: songId } });
    await Playlist.updateMany({ 'songs.song': songId }, { $pull: { songs: { song: songId } } });
    await User.updateMany({ likedSongs: songId }, { $pull: { likedSongs: songId } });
    await User.updateMany({ 'recentlyPlayed.song': songId }, { $pull: { recentlyPlayed: { song: songId } } });
} });

const Song = mongoose.model("Song", songSchema);

export default Song;
