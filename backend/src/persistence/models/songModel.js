import mongoose from "mongoose";
import Album from './albumModel.js';
import Playlist from './playlistModel.js';
import User from './userModel.js';

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
  duration: { type: Number, required: true },
  audioUrl: { type: String },
  releaseDate: { type: Date },
  isExplicit: { type: Boolean, default: false },
  genre: { type: [String], default: [] },
  plays: { type: Number, default: 0 },
  lyrics: { type: String, default: "" },
}, { timestamps: true });

songSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const songId = doc._id;
    await Album.updateMany({ songs: songId }, { $pull: { songs: songId } });
    await Playlist.updateMany({ 'songs.song': songId }, { $pull: { songs: { song: songId } } });
    await User.updateMany({ likedSongs: songId }, { $pull: { likedSongs: songId } });
} });

const Song = mongoose.model("Song", songSchema);

export default Song;