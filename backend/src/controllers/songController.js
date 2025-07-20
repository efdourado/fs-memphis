import { SongService } from '../services/songService.js';

export class SongController {
  constructor() {
    this.songService = new SongService();
  }

  async getAllSongs(req, res) {
    try {
      const songs = await this.songService.getAllSongs();
      res.json(songs);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async getSongById(req, res) {
    try {
      const song = await this.songService.getSongById(req.params.id);
      if (!song) {
        return res.status(404).json({ error: 'Song not found' });
      }
      res.json(song);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async createSong(req, res) {
    try {
      const song = await this.songService.createSong(req.body);
      res.status(201).json(song);
    } catch (error) {
      res.status(error.statusCode || 400).json({ error: error.message });
  } }
  
  async updateSong(req, res) {
    try {
      const updatedSong = await this.songService.updateSong(req.params.id, req.body);
      res.json(updatedSong);
    } catch (error) {
      res.status(error.statusCode || 400).json({ error: error.message });
  } }

  async incrementPlay(req, res) {
    try {
      const song = await this.songService.incrementPlayCount(req.params.id);
      if (!song) {
        return res.status(404).json({ error: 'Song not found' });
      }
      res.status(200).json({ message: 'Play count updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async deleteSong(req, res) {
    try {
      await this.songService.deleteSong(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
} } }