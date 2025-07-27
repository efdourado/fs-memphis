import { ISongDAO } from './interfaces/iSongDAO.js';

export class SongMongooseDAO extends ISongDAO {
  constructor(songModel) {
    super();
    this.model = songModel;
  }

  async findAll() {
    return await this.model.find().populate({ path: 'artist', model: 'User' }).populate('album').lean();
  }

  async findById(id) {
    return await this.model.findById(id).populate({ path: 'artist', model: 'User' }).populate('album').lean();
  }
  
  async findByAlbumId(albumId) {
    return await this.model.find({ album: albumId }).populate({ path: 'artist', model: 'User' }).populate('album').lean();
  }

  async findByArtist(artistId) {
    return await this.model.find({ artist: artistId }).populate({ path: 'artist', model: 'User' }).populate('album').sort({ plays: -1 }).lean();
  }

  async incrementPlayCount(id) {
    return await this.model.findByIdAndUpdate(id, { $inc: { plays: 1 } }, { new: true }).lean();
  }

  async create(songDTO) {
    return await this.model.create(songDTO);
  }

  async updateById(id, songDTO) {
    return await this.model.findByIdAndUpdate(id, songDTO, { new: true }).lean();
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id).lean();
} }