import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },

  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  songs: [{ 
    song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
    addedAt: { type: Date, default: Date.now }
  }],
  coverImage: { type: String, default: '' },
  isPublic: { type: Boolean, default: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: { type: [String], default: [] },
  collaborative: { type: Boolean, default: false },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Playlist = mongoose.model('Playlist', playlistSchema);

export class PlaylistModel {
  async findAll() {
    return await Playlist.find().populate('owner');
  }

  async findById(id) {
    return await Playlist.findById(id)
      .populate('owner')
      .populate({
        path: 'songs.song',
        populate: {
          path: 'artist',
          model: 'User'
  } }); }

  async findByOwner(ownerId) {
    return await Playlist.find({ owner: ownerId }).populate('owner').lean();
  }

  async create(playlistData) {
    const playlist = new Playlist(playlistData);
    return await playlist.save();
  }

  async updateById(id, updateData) {
    return await Playlist.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return await Playlist.findByIdAndDelete(id);
  }

  async addSong(playlistId, songId) {
    return await Playlist.findOneAndUpdate(
      { _id: playlistId, 'songs.song': { $ne: songId } },
      { $push: { songs: { song: songId, addedAt: new Date() } } },
      { new: true }
  ); }

  async removeSong(playlistId, songId) {
    return await Playlist.findByIdAndUpdate(
      playlistId,
      { $pull: { songs: { song: songId } } },
      { new: true }
); } }

export default Playlist;