import { SongDAO } from '../persistence/daos/songDAO.js';

export class SongService {
  constructor() {
    this.songDAO = new SongDAO();
  }

  async getAllSongs() {
    return this.songDAO.findAll();
  }

  async getSongById(id) {
    return this.songDAO.findById(id);
  }

  async getSongsByAlbumId(albumId) {
    return this.songDAO.findByAlbumId(albumId);
  }

  async createSong(songData) {
    if (!songData.audioUrl || !songData.duration) {
      const err = new Error('Audio URL and duration are required.');
      err.statusCode = 400;
      throw err;
    }
    return await this.songDAO.create(songData);
  }

  async updateSong(id, updateData) {
    const updatedSong = await this.songDAO.updateById(id, updateData);
    if (!updatedSong) {
      const err = new Error('Song not found');
      err.statusCode = 404;
      throw err;
    }
    return updatedSong;
  }

  async incrementPlayCount(id) {
    return await this.songDAO.incrementPlayCount(id);
  }

  async deleteSong(id) {
    const song = await this.songDAO.deleteById(id);
    if (!song) {
        const err = new Error('Song not found');
        err.statusCode = 404;
        throw err;
    }
    return song;
} }