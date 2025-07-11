import mongoose from "mongoose";
import Artist from './artistModel.js';
import Album from './albumModel.js';
import Playlist from './playlistModel.js';
import User from './userModel.js';

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
  duration: { type: Number, required: true },
  audioUrl: { type: String },
  coverImage: { type: String, default: "" },
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
    await Artist.updateMany({ topSongs: songId }, { $pull: { topSongs: songId } });
    if (doc.artist) {
        const artistModel = new Artist.ArtistModel();
        await artistModel.updateTopSongs(doc.artist);
} } });

const Song = mongoose.model("Song", songSchema);

export class SongModel {
  async findAll() {
    return await Song.find().populate('artist').populate('album');
  }

  async findById(id) {
    return await Song.findById(id).populate('artist');
  }

  async incrementPlayCount(id) {
    return await Song.findByIdAndUpdate(id, { $inc: { plays: 1 } }, { new: true });
  }

  async create(songData) {
    const song = new Song(songData);
    return await song.save();
  }

  async updateById(id, updateData) {
    return await Song.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return await Song.findOneAndDelete({ _id: id });
} }

export default Song;