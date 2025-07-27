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

export class SongModel {
  async findAll() {
    return await Song.find().populate({ path: 'artist', model: 'User' }).populate('album').lean();
  }

  async findById(id) {
    return await Song.findById(id)
      .populate({ path: 'artist', model: 'User' })
      .populate('album') 
      .lean();
  }

  async findByAlbumId(albumId) {
    return await Song.find({ album: albumId }).populate({ path: 'artist', model: 'User' }).populate('album').lean();
  }

  async findByArtist(artistId) {
    return await Song.find({ artist: artistId })
      .populate({ path: 'artist', model: 'User' })
      .populate('album')
      .sort({ plays: -1 })
      .lean();
  }

  async incrementPlayCount(id) {
    return await Song.findByIdAndUpdate(id, { $inc: { plays: 1 } }, { new: true }).lean();
  }

  async create(songData) {
    const song = new Song(songData);
    const savedSong = await song.save();
    return savedSong.toObject();
  }

  async updateById(id, updateData) {
    return await Song.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }

  async deleteById(id) {
    return await Song.findOneAndDelete({ _id: id }).lean();
} }

export default Song;