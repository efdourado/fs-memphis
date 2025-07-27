import { IPlaylistDAO } from '../../interfaces/daos/iPlaylistDAO.js';
import PlaylistModel from '../models/playlistModel.js';

export class PlaylistDAO extends IPlaylistDAO {
  constructor() {
    super();
  }

  async findAll() {
    return await PlaylistModel.find().populate('owner');
  }

  async findById(id) {
    return await PlaylistModel.findById(id).populate('owner').populate({
      path: 'songs.song',
      populate: [{ path: 'artist', model: 'User' }, { path: 'album', model: 'Album' }]
  }); }
  
  async findByOwner(ownerId) {
    return await PlaylistModel.find({ owner: ownerId }).populate('owner').lean();
  }

  async create(playlistDTO) {
    const newPlaylist = await PlaylistModel.create(playlistDTO.toJSON());
    return newPlaylist;
  }

  async updateById(playlistDTO) {
    const updatedPlaylist = await PlaylistModel.findByIdAndUpdate(playlistDTO.id, playlistDTO.toJSON(), { new: true });
    return updatedPlaylist;
  }

  async deleteById(playlistDTO) {
    const deletedPlaylist = await PlaylistModel.findByIdAndDelete(playlistDTO.id);
    return deletedPlaylist;
  }

  async addSong(playlistId, songId) {
    return await PlaylistModel.findByIdAndUpdate(
      playlistId,
      { $push: { songs: { song: songId, addedAt: new Date() } } },
      { new: true }
  ); }

  async removeSong(playlistId, songId) {
    return await PlaylistModel.findByIdAndUpdate(
      playlistId,
      { $pull: { songs: { song: songId } } },
      { new: true }
); } }