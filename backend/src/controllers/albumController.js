import { IAlbumController } from '../interfaces/controllers/iAlbumController.js';
import { AlbumDAO } from '../persistence/daos/albumDAO.js';
import { AlbumDTO } from '../persistence/dtos/albumDTO.js';
import { SongDAO } from '../persistence/daos/songDAO.js';

const albumDAO = new AlbumDAO();
const songDAO = new SongDAO();

export class AlbumController extends IAlbumController {
  async getAllAlbums(req, res) {
    try {
      const albums = await albumDAO.findAll();
      const albumsWithSongs = await Promise.all(
        albums.map(async (album) => {
          const songs = await songDAO.findByAlbumId(album._id);
          return { ...album.toObject(), songs: songs };
      }) );
      
      res.json(albumsWithSongs);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async getAlbumById(req, res) {
    try {
      const album = await albumDAO.findById(req.params.id);
      if (!album) {
        return res.status(404).json({ error: 'Album not found' });
      }
      const songs = await songDAO.findByAlbumId(req.params.id);
      const responseData = { ...album.toObject(), songs: songs };
      res.json(responseData);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async createAlbum(req, res) {
    const albumDTO = new AlbumDTO();
    albumDTO.title = req.body.title;
    albumDTO.artist = req.body.artist;
    albumDTO.releaseDate = req.body.releaseDate;
    albumDTO.coverImage = req.body.coverImage;
    albumDTO.genre = req.body.genre;
    albumDTO.type = req.body.type;

    try {
      const newAlbum = await albumDAO.create(albumDTO);
      res.status(201).json(newAlbum);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async updateAlbum(req, res) {
    const albumDTO = new AlbumDTO();
    albumDTO.id = req.params.id;
    albumDTO.title = req.body.title;
    albumDTO.artist = req.body.artist;
    albumDTO.releaseDate = req.body.releaseDate;
    albumDTO.coverImage = req.body.coverImage;
    albumDTO.genre = req.body.genre;
    albumDTO.type = req.body.type;

    try {
      const updatedAlbum = await albumDAO.updateById(albumDTO);
      if (!updatedAlbum) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.json(updatedAlbum);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async deleteAlbum(req, res) {
    const albumDTO = new AlbumDTO();
    albumDTO.id = req.params.id;

    try {
      const deletedAlbum = await albumDAO.deleteById(albumDTO);
      if (!deletedAlbum) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async getAlbumsByArtist(req, res) {
    try {
      const albums = await albumDAO.findByArtist(req.params.artistId);
      res.json(albums);
    } catch (error) {
      res.status(500).json({ error: error.message });
} } }