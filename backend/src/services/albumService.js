import { AlbumModel } from '../models/albumModel.js';

export class AlbumService {
  constructor() {
    this.albumModel = new AlbumModel();
  }

  async getAllAlbums() {
    return await this.albumModel.findAll();
  }

  async getAlbumById(id) {
    return await this.albumModel.findById(id);
  }

  async createAlbum(albumData) {
    return await this.albumModel.create(albumData);
  }

  async updateAlbum(id, updateData) {
    return await this.albumModel.updateById(id, updateData);
  }

  async deleteAlbum(id) {
    return await this.albumModel.deleteById(id);
  }

  async getAlbumsByArtist(artistId) {
    return await this.albumModel.findByArtist(artistId);
} }