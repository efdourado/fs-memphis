import { IPlaylistDAO } from '../../interfaces/daos/iPlaylistDAO.js';

export class PlaylistMongooseDAO extends IPlaylistDAO {
  constructor(playlistModel) {
    super();
    this.model = playlistModel;
  }

  async findAll() {
    return await this.model.find().populate('owner');
  }

  async findById(id) {
    return await this.model.findById(id).populate('owner').populate({
      path: 'songs.song',
      populate: [{ path: 'artist', model: 'User' }, { path: 'album', model: 'Album' }]
    });
  }
  
  async findByOwner(ownerId) {
    return await this.model.find({ owner: ownerId }).populate('owner').lean();
  }

  async create(playlistDTO) {
    return await this.model.create(playlistDTO);
  }

  async updateById(id, playlistDTO) {
    return await this.model.findByIdAndUpdate(id, playlistDTO, { new: true });
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async addSong(playlistId, songId) {
    return await this.model.findByIdAndUpdate(
      playlistId,
      { $push: { songs: { song: songId, addedAt: new Date() } } },
      { new: true }
  ); }

  async removeSong(playlistId, songId) {
    return await this.model.findByIdAndUpdate(
      playlistId,
      { $pull: { songs: { song: songId } } },
      { new: true }
); } }