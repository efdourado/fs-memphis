import { ISongController } from '../interfaces/controllers/iSongController.js';
import { SongDAO_Encap_Mongoose } from '../persistence/daos/songDAO_Encap_Mongoose.js';
import { SongDTO } from '../persistence/dtos/SongDTO.js';

const songDAO = new SongDAO_Encap_Mongoose();

export class SongController extends ISongController {
  async getAllSongs(req, res) {
    try {
      const songs = await songDAO.findAll();
      res.json(songs);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async getSongById(req, res) {
    try {
      const song = await songDAO.findById(req.params.id);
      if (!song) {
        return res.status(404).json({ error: 'Song not found' });
      }
      res.json(song);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async createSong(req, res) {
    const songDTO = new SongDTO();
    Object.assign(songDTO, req.body);

    try {
      if (!songDTO.audioUrl || !songDTO.duration) {
        return res.status(400).json({ error: 'Audio URL and duration are required.' });
      }
      const newSong = await songDAO.create(songDTO);
      res.status(201).json(newSong);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async updateSong(req, res) {
    const songDTO = new SongDTO();
    songDTO.id = req.params.id;
    Object.assign(songDTO, req.body);
    
    try {
      const updatedSong = await songDAO.updateById(songDTO);
      if (!updatedSong) {
        return res.status(404).json({ error: 'Song not found' });
      }
      res.json(updatedSong);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async incrementPlay(req, res) {
    try {
      const song = await songDAO.incrementPlayCount(req.params.id);
      if (!song) {
        return res.status(404).json({ error: 'Song not found' });
      }
      res.status(200).json({ message: 'Play count updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async deleteSong(req, res) {
    const songDTO = new SongDTO();
    songDTO.id = req.params.id;

    try {
      const deletedSong = await songDAO.deleteById(songDTO);
      if (!deletedSong) {
        return res.status(404).json({ error: 'Song not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
} } }