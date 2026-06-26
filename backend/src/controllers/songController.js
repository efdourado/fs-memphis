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
    const song = await this.songService.recordPlay(req.params.id, {
      userId: req.user?._id,
      context: req.body?.context,
      activity: req.body?.activity,
      source: req.body?.source,
    });
    res.status(200).json({ message: 'Play count updated successfully', plays: song.plays });
  });

  trackShare = asyncHandler(async (req, res) => {
    const result = await this.songService.trackShare(req.params.id);
    res.json(result);
  });

  getRecommendations = asyncHandler(async (req, res) => {
    const songs = await this.songService.getRecommendations({
      userId: req.user?._id,
      activity: req.query.activity,
      mode: req.query.mode,
      limit: Number(req.query.limit) || 20,
    });
    res.json(songs);
  });

  getExplainableShuffle = asyncHandler(async (req, res) => {
    const result = await this.songService.getExplainableShuffle({
      userId: req.user?._id,
      activity: req.query.activity,
      mode: req.query.mode,
      limit: Number(req.query.limit) || 50,
    });
    res.json(result);
  });

  deleteSong = asyncHandler(async (req, res) => {
    await this.songService.deleteSong(req.params.id);
    res.status(204).send();
}); }
