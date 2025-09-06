import AppError from './appError.js';

export class SongService {
  constructor(songDAO) {
    this.songDAO = songDAO;
  }

  async getAllSongs() {
    return this.songDAO.findAll();
  }

  async getSongById(id) {
    const song = await this.songDAO.findById(id);
    if (!song) {
      throw new AppError('Song not found', 404);
    }
    return song;
  }
  
  async createSong(songData) {
    if (!songData.title || !songData.artist || !songData.durationMs) {
      throw new AppError('Title, artist, and duration (ms) are required.', 400);
    }
    return await this.songDAO.create(songData);
  }

  async updateSong(id, updateData) {
    const updatedSong = await this.songDAO.updateById(id, updateData);
    if (!updatedSong) {
      throw new AppError('Song not found', 404);
    }
    return updatedSong;
  }
  
  async deleteSong(id) {
    const deletedSong = await this.songDAO.deleteById(id);
    if (!deletedSong) {
      throw new AppError('Song not found', 404);
    }
    return deletedSong;
  }
  
  async incrementPlayCount(id) {
    const song = await this.songDAO.incrementPlayCount(id);
     if (!song) {
        console.warn(`Attempted to increment play count for non-existent song ID: ${id}`);
        return null;
    }
    return song;
} }