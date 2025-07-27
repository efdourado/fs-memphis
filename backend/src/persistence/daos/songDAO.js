import { ISongDAO } from '../../interfaces/daos/iSongDAO.js';
import SongModel from '../models/songModel.js';

export class SongDAO extends ISongDAO {
  constructor() {
    super();
  }

  async findAll() {
    return await SongModel.find().populate({ path: 'artist', model: 'User' }).populate('album').lean();
  }

  async findById(id) {
    return await SongModel.findById(id).populate({ path: 'artist', model: 'User' }).populate('album').lean();
  }
  
  async findByAlbumId(albumId) {
    return await SongModel.find({ album: albumId }).populate({ path: 'artist', model: 'User' }).populate('album').lean();
  }

  async findByArtist(artistId) {
    return await SongModel.find({ artist: artistId }).populate({ path: 'artist', model: 'User' }).populate('album').sort({ plays: -1 }).lean();
  }

  async incrementPlayCount(id) {
    return await SongModel.findByIdAndUpdate(id, { $inc: { plays: 1 } }, { new: true }).lean();
  }

  async create(songDTO) {
    const newSong = await SongModel.create(songDTO.toJSON());
    return newSong;
  }

  async updateById(songDTO) {
    const updatedSong = await SongModel.findByIdAndUpdate(songDTO.id, songDTO.toJSON(), { new: true }).lean();
    return updatedSong;
  }

  async deleteById(songDTO) {
    const deletedSong = await SongModel.findByIdAndDelete(songDTO.id).lean();
    return deletedSong;
} }