import AppError from './appError.js';

export class PlaylistService {
  constructor(playlistDAO, songDAO) {
    this.playlistDAO = playlistDAO;
    this.songDAO = songDAO;
  }

  async _getAndCheckOwnership(playlistId, userId) {
    const playlist = await this.playlistDAO.findById(playlistId);
    if (!playlist) {
      throw new AppError('Playlist not found', 404);
    }
    if (playlist.owner._id.toString() !== userId.toString()) {
      throw new AppError('User not authorized to modify this playlist', 403);
    }
    return playlist;
  }
  
  async getAllPlaylists() {
    return this.playlistDAO.findAll();
  }

  async getPlaylistById(id) {
    const playlist = await this.playlistDAO.findById(id);
    if (!playlist) {
      throw new AppError('Playlist not found', 404);
    }
    return playlist;
  }

  async getPlaylistsByOwner(ownerId) {
    return this.playlistDAO.findByOwner(ownerId);
  }

  async createPlaylist(playlistData, ownerId) {
    const playlistDTO = { ...playlistData, owner: ownerId };
    return this.playlistDAO.create(playlistDTO);
  }

  async updatePlaylist(playlistId, updateData, userId) {
    await this._getAndCheckOwnership(playlistId, userId);
    return this.playlistDAO.updateById(playlistId, updateData);
  }

  async deletePlaylist(playlistId, userId) {
    await this._getAndCheckOwnership(playlistId, userId);
    return this.playlistDAO.deleteById(playlistId);
  }

  async addSongToPlaylist(playlistId, songId, userId) {
    const playlist = await this._getAndCheckOwnership(playlistId, userId);

    const song = await this.songDAO.findById(songId);
    if (!song) {
      throw new AppError('Song not found', 404);
    }

    const songExists = playlist.songs.some(item => item.song && item.song._id.toString() === songId);
    if (songExists) {
      throw new AppError('Song is already in this playlist.', 409);
    }

    return this.playlistDAO.addSong(playlistId, songId);
  }

  async removeSongFromPlaylist(playlistId, songId, userId) {
    await this._getAndCheckOwnership(playlistId, userId);
    return this.playlistDAO.removeSong(playlistId, songId);
} }