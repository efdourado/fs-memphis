import { AlbumService } from '../services/albumService.js';
import { SongService } from '../services/songService.js';

export class AlbumController {
  constructor() {
    this.albumService = new AlbumService();
    this.songService = new SongService();
  }

  async getAllAlbums(req, res) {
    try {
      const albums = await this.albumService.getAllAlbums();

      const albumsWithSongs = await Promise.all(
        albums.map(async (album) => {
          const songs = await this.songService.getSongsByAlbumId(album._id);
          return {
            ...album.toObject(),
            songs: songs,
      }; }) );

      res.json(albumsWithSongs);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async getAlbumById(req, res) {
    const { id } = req.params;
    try {
      const album = await this.albumService.getAlbumById(id);
      if (!album) {
        return res.status(404).json({ error: 'Album not found' });
      }

      const songs = await this.songService.getSongsByAlbumId(id);

      const responseData = {
        ...album.toObject(),
        songs: songs,
      };

      res.json(responseData);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async createAlbum(req, res) {
    try {
      const album = await this.albumService.createAlbum(req.body);
      res.status(201).json(album);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async updateAlbum(req, res) {
    const { id } = req.params;
    try {
      const updatedAlbum = await this.albumService.updateAlbum(id, req.body);
      if (!updatedAlbum) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.json(updatedAlbum);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async deleteAlbum(req, res) {
    const { id } = req.params;
    try {
      const album = await this.albumService.deleteAlbum(id);
      if (!album) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async getAlbumsByArtist(req, res) {
    const { artistId } = req.params;
    try {
      const albums = await this.albumService.getAlbumsByArtist(artistId);
      res.json(albums);
    } catch (error) {
      res.status(500).json({ error: error.message });
} } }