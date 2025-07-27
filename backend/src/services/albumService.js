import AppError from './appError.js';

export class AlbumService {
  constructor(albumDAO, songDAO) {
    this.albumDAO = albumDAO;
    this.songDAO = songDAO;
  }

  async getAllAlbumsWithSongs() {
    const albums = await this.albumDAO.findAll();
    const albumsWithSongs = await Promise.all(
      albums.map(async (album) => {
        const songs = await this.songDAO.findByAlbumId(album._id);
        return { ...album.toObject(), songs };
    }) );
    
    return albumsWithSongs;
  }

  async getAlbumWithSongs(id) {
    const album = await this.albumDAO.findById(id);
    if (!album) {
      throw new AppError('Album not found', 404);
    }
    const songs = await this.songDAO.findByAlbumId(id);
    return { ...album.toObject(), songs };
  }
  
  async getAlbumsByArtist(artistId) {
    return await this.albumDAO.findByArtist(artistId);
  }

  async createAlbum(albumData) {
    if (!albumData.title || !albumData.artist || !albumData.releaseDate) {
        throw new AppError('Title, artist, and release date are required for an album.', 400);
    }
    return await this.albumDAO.create(albumData);
  }

  async updateAlbum(id, updateData) {
    const updatedAlbum = await this.albumDAO.updateById(id, updateData);
    if (!updatedAlbum) {
      throw new AppError('Album not found', 404);
    }
    return updatedAlbum;
  }

  async deleteAlbum(id) {
    const songsInAlbum = await this.songDAO.findByAlbumId(id);
    for (const song of songsInAlbum) {
        await this.songDAO.deleteById(song._id);
    }

    const deletedAlbum = await this.albumDAO.deleteById(id);
    if (!deletedAlbum) {
      throw new AppError('Album not found', 404);
    }
    return deletedAlbum;
} }