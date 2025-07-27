import { IAlbumDAO } from '../../interfaces/daos/iAlbumDAO.js';

export class AlbumMongooseDAO extends IAlbumDAO {
  constructor(albumModel) {
    super();
    this.model = albumModel;
  }

  async findAll() {
    return await this.model.find().populate('artist');
  }

  async findById(id) {
    return await this.model.findById(id).populate('artist');
  }

  async findByArtist(artistId) {
    return await this.model.find({ artist: artistId }).populate('artist');
  }

  async create(albumDTO) {
    return await this.model.create(albumDTO);
  }

  async updateById(id, albumDTO) {
    return await this.model.findByIdAndUpdate(id, albumDTO, { new: true });
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
} }