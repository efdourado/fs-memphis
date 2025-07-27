import { PlaylistDAO } from '../persistence/daos/playlistDAO.js';

export class PlaylistService {
  constructor() {
    this.playlistDAO = new PlaylistDAO();
  }

  async getAllPlaylists() {
    return this.playlistDAO.findAll();
  }

  async getPlaylistById(id) {
    return this.playlistDAO.findById(id);
  }

  async getPlaylistsByOwner(ownerId) {
    return this.playlistDAO.findByOwner(ownerId);
  }

  async createPlaylist(playlistData) {
    return this.playlistDAO.create(playlistData);
  }

  async updatePlaylist(id, updateData) {
    return this.playlistDAO.updateById(id, updateData);
  }

  async deletePlaylist(id) {
    return this.playlistDAO.deleteById(id);
  }

  async addSongToPlaylist(playlistId, songId) {
    const updatedPlaylist = await this.playlistDAO.addSong(playlistId, songId);
    if (!updatedPlaylist) {
      const err = new Error('Song is already in this playlist.');
      err.statusCode = 409;
      throw err;
    }
    return updatedPlaylist;
  }

  async removeSongFromPlaylist(playlistId, songId) {
    return this.playlistDAO.removeSong(playlistId, songId);
} }