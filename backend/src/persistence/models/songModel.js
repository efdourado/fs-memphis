import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
  durationMs: { type: Number, required: true },
  audioUrl: { type: String },
  isExplicit: { type: Boolean, default: false },
  lyrics: { type: String, default: "" },
  plays: { type: Number, default: 0 },
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
    loudness: Number
  },

  editorial: {
    story: String,
    productionNotes: String,
    notableSamples: [String]
  },
  credits: {
    writers: [String],
    producers: [String],
    mastering: [String],
    studio: String
  },

  externalLinks: {
    spotify: String,
    youtube: String,
    soundcloud: String,
    genius: String
  }

}, { timestamps: true });

songSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const songId = doc._id;
    const Album = mongoose.model('Album');
    const Playlist = mongoose.model('Playlist');
    const User = mongoose.model('User');

    await Album.updateMany({ songs: songId }, { $pull: { songs: songId } });
    await Playlist.updateMany({ 'songs.song': songId }, { $pull: { songs: { song: songId } } });
    await User.updateMany({ likedSongs: songId }, { $pull: { likedSongs: songId } });
} });

const Song = mongoose.model("Song", songSchema);

export default Song;