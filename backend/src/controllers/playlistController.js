import { IPlaylistController } from '../interfaces/controllers/iPlaylistController.js';
import asyncHandler from '../middlewares/asyncHandler.js';

export class PlaylistController extends IPlaylistController {
  constructor(playlistService) {
    super();
    this.playlistService = playlistService;
  }

  getAllPlaylists = asyncHandler(async (req, res) => {
    const playlists = await this.playlistService.getAllPlaylists();
    res.json(playlists);
  });

  getPlaylistById = asyncHandler(async (req, res) => {
    const playlist = await this.playlistService.getPlaylistById(req.params.id);
    res.json(playlist);
  });

  getMyPlaylists = asyncHandler(async (req, res) => {
      const playlists = await this.playlistService.getPlaylistsByOwner(req.user._id);
      res.json(playlists);
  });
  
  createPlaylist = asyncHandler(async (req, res) => {
    const playlist = await this.playlistService.createPlaylist(req.body, req.user._id);
    res.status(201).json(playlist);
  });

  updatePlaylist = asyncHandler(async (req, res) => {
    const updatedPlaylist = await this.playlistService.updatePlaylist(req.params.id, req.body, req.user._id);
    res.json(updatedPlaylist);
  });

  deletePlaylist = asyncHandler(async (req, res) => {
    await this.playlistService.deletePlaylist(req.params.id, req.user._id);
    res.status(204).send();
  });

  addSongToPlaylist = asyncHandler(async (req, res) => {
    const { id, songId } = req.params;
    const updatedPlaylist = await this.playlistService.addSongToPlaylist(id, songId, req.user._id);
    res.json(updatedPlaylist);
  });

  removeSongFromPlaylist = asyncHandler(async (req, res) => {
    const { id, songId } = req.params;
    const updatedPlaylist = await this.playlistService.removeSongFromPlaylist(id, songId, req.user._id);
    res.json(updatedPlaylist);
}); }