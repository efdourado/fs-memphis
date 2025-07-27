import { IPlaylistController } from '../interfaces/controllers/iPlaylistController.js';
import { PlaylistDAO } from '../persistence/daos/playlistDAO.js';
import { PlaylistDTO } from '../persistence/dtos/playlistDTO.js';
import { SongDAO } from '../persistence/daos/songDAO.js';

const playlistDAO = new PlaylistDAO();
const songDAO = new SongDAO();

export class PlaylistController extends IPlaylistController {

  async _checkOwnership(playlistId, userId) {
    const playlist = await playlistDAO.findById(playlistId);
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
      const playlists = await playlistDAO.findAll();
      res.json(playlists);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
  } }

  async getPlaylistById(req, res) {
    try {
      const playlist = await playlistDAO.findById(req.params.id);
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
      res.json(playlist);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
  } }

  async getPlaylistsByOwner(req, res) {
     try {
      const playlists = await playlistDAO.findByOwner(req.params.ownerId);
      res.json(playlists);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
  } }

  async getMyPlaylists(req, res) {
    try {
      const playlists = await playlistDAO.findByOwner(req.user._id);
      res.json(playlists);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
  } }

  async createPlaylist(req, res) {
    const playlistDTO = new PlaylistDTO();
    Object.assign(playlistDTO, req.body);
    playlistDTO.owner = req.user._id;

    try {
      const playlist = await playlistDAO.create(playlistDTO);
      res.status(201).json(playlist);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
  } }

  async updatePlaylist(req, res) {
    const playlistDTO = new PlaylistDTO();
    playlistDTO.id = req.params.id;
    Object.assign(playlistDTO, req.body);
    
    try {
      await this._checkOwnership(req.params.id, req.user._id);
      const updatedPlaylist = await playlistDAO.updateById(playlistDTO);
      res.json(updatedPlaylist);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
  } }

  async deletePlaylist(req, res) {
    const playlistDTO = new PlaylistDTO();
    playlistDTO.id = req.params.id;
    
    try {
      await this._checkOwnership(req.params.id, req.user._id);
      await playlistDAO.deleteById(playlistDTO);
      res.status(204).end();
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
  } }

  async addSongToPlaylist(req, res) {
    try {
      const { id, songId } = req.params;
      await this._checkOwnership(id, req.user._id);
      const updatedPlaylist = await playlistDAO.addSong(id, songId);
      res.json(updatedPlaylist);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
  } }

  async removeSongFromPlaylist(req, res) {
    try {
      const { id, songId } = req.params;
      await this._checkOwnership(id, req.user._id);
      const updatedPlaylist = await playlistDAO.removeSong(id, songId);
      res.json(updatedPlaylist);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
} } }