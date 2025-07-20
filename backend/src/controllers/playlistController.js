import { PlaylistService } from '../services/playlistService.js';
import { SongService } from '../services/songService.js';

export class PlaylistController {
  constructor() {
    this.playlistService = new PlaylistService();
    this.songService = new SongService();
  }

  async _checkOwnership(playlistId, userId) {
    const playlist = await this.playlistService.getPlaylistById(playlistId);
    if (!playlist) {
      const err = new Error('Playlist not found');
      err.statusCode = 404;
      throw err;
    }
    if (playlist.owner._id.toString() !== userId.toString()) {
      const err = new Error('User not authorized');
      err.statusCode = 403;
      throw err;
    }
    return playlist;
  }

  async getAllPlaylists(req, res) {
    try {
      const playlists = await this.playlistService.getAllPlaylists();

      const playlistsWithSongs = await Promise.all(
        playlists.map(async (playlist) => {
          const songDocs = await Promise.all(
            playlist.songs.map(item => this.songService.getSongById(item.song))
          );

          return {
            ...playlist.toObject(),
            songs: songDocs.filter(Boolean).map(song => ({ song })),
      }; }) );

      res.json(playlistsWithSongs);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
  } }

  async getPlaylistById(req, res) {
    try {
      const playlist = await this.playlistService.getPlaylistById(req.params.id);
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
      res.json(playlist);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
  } }

  async getPlaylistsByOwner(req, res) {
    const { ownerId } = req.params;
    try {
      const playlists = await this.playlistService.getPlaylistsByOwner(ownerId);
      res.json(playlists);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
  } }

  async getMyPlaylists(req, res) {
    try {
      const playlists = await this.playlistService.getPlaylistsByOwner(req.user._id);
      res.json(playlists);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
  } }

  async createPlaylist(req, res) {
    try {
      const playlistData = { ...req.body, owner: req.user._id };
      const playlist = await this.playlistService.createPlaylist(playlistData);
      res.status(201).json(playlist);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
  } }

  async updatePlaylist(req, res) {
    try {
      await this._checkOwnership(req.params.id, req.user._id);
      const updatedPlaylist = await this.playlistService.updatePlaylist(req.params.id, req.body);
      res.json(updatedPlaylist);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
  } }

  async deletePlaylist(req, res) {
    try {
      await this._checkOwnership(req.params.id, req.user._id);
      await this.playlistService.deletePlaylist(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
  } }

  async addSongToPlaylist(req, res) {
    try {
      const { id, songId } = req.params;
      await this._checkOwnership(id, req.user._id);
      const updatedPlaylist = await this.playlistService.addSongToPlaylist(id, songId);
      res.json(updatedPlaylist);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
  } }

  async removeSongFromPlaylist(req, res) {
    try {
      const { id, songId } = req.params;
      await this._checkOwnership(id, req.user._id);
      const updatedPlaylist = await this.playlistService.removeSongFromPlaylist(id, songId);
      res.json(updatedPlaylist);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
} } }