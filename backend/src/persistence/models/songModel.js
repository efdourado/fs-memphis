import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
  duration: { type: Number, required: true },
  audioUrl: { type: String },
  isExplicit: { type: Boolean, default: false },
  genre: { type: [String], default: [] },
  plays: { type: Number, default: 0 },
  lyrics: { type: String, default: "" },
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