import { PlaylistModel } from '../models/playlistModel.js';

export class PlaylistService {
  constructor() {
    this.playlistModel = new PlaylistModel();
  }

  async getAllPlaylists() {
    return this.playlistModel.findAll();
  }

  async getPlaylistById(id) {
    return this.playlistModel.findById(id);
  }

  async getPlaylistsByOwner(ownerId) {
    return this.playlistModel.findByOwner(ownerId);
  }
  
  async createPlaylist(playlistData) {
    return this.playlistModel.create(playlistData);
  }

  async updatePlaylist(id, updateData) {
    return this.playlistModel.updateById(id, updateData);
  }

  async deletePlaylist(id) {
    return this.playlistModel.deleteById(id);
  }

  async addSongToPlaylist(playlistId, songId) {
    const updatedPlaylist = await this.playlistModel.addSong(playlistId, songId);
    if (!updatedPlaylist) {
      const err = new Error('Song is already in this playlist.');
      err.statusCode = 409;
      throw err;
    }
    return updatedPlaylist;
  }

  async removeSongFromPlaylist(playlistId, songId) {
    return this.playlistModel.removeSong(playlistId, songId);
} }