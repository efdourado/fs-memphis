import { AlbumDAO } from '../persistence/daos/albumDAO.js';

export class AlbumService {
  constructor() {
    this.albumDAO = new AlbumDAO();
  }

  async getAllAlbums() {
    return await this.albumDAO.findAll();
  }

  async getAlbumById(id) {
    return await this.albumDAO.findById(id);
  }

  async createAlbum(albumData) {
    return await this.albumDAO.create(albumData);
  }

  async updateAlbum(id, updateData) {
    return await this.albumDAO.updateById(id, updateData);
  }

  async deleteAlbum(id) {
    return await this.albumDAO.deleteById(id);
  }

  async getAlbumsByArtist(artistId) {
    return await this.albumDAO.findByArtist(artistId);
} }