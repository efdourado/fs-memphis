import { SongModel } from '../models/songModel.js';

export class SongService {
  constructor() {
    this.songModel = new SongModel();
  }

  async getAllSongs() {
    return this.songModel.findAll();
  }

  async getSongById(id) {
    return this.songModel.findById(id);
  }

  async getSongsByAlbumId(albumId) {
    return this.songModel.findByAlbumId(albumId);
  }

  async createSong(songData) {
    if (!songData.audioUrl || !songData.duration) {
      const err = new Error('Audio URL and duration are required.');
      err.statusCode = 400;
      throw err;
    }
    const song = await this.songModel.create(songData);
    return song;
  }
  
  async updateSong(id, updateData) {
    const updatedSong = await this.songModel.updateById(id, updateData);
    if (!updatedSong) {
      const err = new Error('Song not found');
      err.statusCode = 404;
      throw err;
    }
    return updatedSong;
  }

  async incrementPlayCount(id) {
    const song = await this.songModel.incrementPlayCount(id);
    return song;
  }

  async deleteSong(id) {
    const song = await this.songModel.deleteById(id);
    if (!song) {
        const err = new Error('Song not found');
        err.statusCode = 404;
        throw err;
    }
    return song;
} }