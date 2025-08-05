import asyncHandler from '../middlewares/asyncHandler.js';

export class SongController {
  constructor(songService) {
    this.songService = songService;
  }

  getAllSongs = asyncHandler(async (req, res) => {
    const songs = await this.songService.getAllSongs();
    res.json(songs);
  });

  getSongById = asyncHandler(async (req, res) => {
    const song = await this.songService.getSongById(req.params.id);
    res.json(song);
  });

  createSong = asyncHandler(async (req, res) => {
    const newSong = await this.songService.createSong(req.body);
    res.status(201).json(newSong);
  });

  updateSong = asyncHandler(async (req, res) => {
    const updatedSong = await this.songService.updateSong(req.params.id, req.body);
    res.json(updatedSong);
  });

  incrementPlay = asyncHandler(async (req, res) => {
    await this.songService.incrementPlayCount(req.params.id);
    res.status(200).json({ message: 'Play count updated successfully' });
  });

  deleteSong = asyncHandler(async (req, res) => {
    await this.songService.deleteSong(req.params.id);
    res.status(204).send();
}); }