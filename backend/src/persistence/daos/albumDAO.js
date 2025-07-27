import { IAlbumDAO } from '../../interfaces/daos/iAlbumDAO.js';
import AlbumModel from '../models/albumModel.js';

export class AlbumDAO extends IAlbumDAO {
  constructor() {
    super();
  }

  async findAll() {
    return await AlbumModel.find().populate('artist');
  }

  async findById(id) {
    return await AlbumModel.findById(id).populate('artist');
  }

  async findByArtist(artistId) {
    return await AlbumModel.find({ artist: artistId }).populate('artist');
  }

  async create(albumDTO) {
    const newAlbum = await AlbumModel.create(albumDTO.toJSON());
    return newAlbum;
  }

  async updateById(albumDTO) {
    const updatedAlbum = await AlbumModel.findByIdAndUpdate(albumDTO.id, albumDTO.toJSON(), { new: true });
    return updatedAlbum;
  }

  async deleteById(albumDTO) {
    const deletedAlbum = await AlbumModel.findByIdAndDelete(albumDTO.id);
    return deletedAlbum;
} }