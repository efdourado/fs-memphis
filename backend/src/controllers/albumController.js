import asyncHandler from '../middlewares/asyncHandler.js';

export class AlbumController {
  constructor(albumService) {
    this.albumService = albumService;
  }

  getAllAlbums = asyncHandler(async (req, res) => {
    const albums = await this.albumService.getAllAlbumsWithSongs();
    res.json(albums);
  });

  getAlbumById = asyncHandler(async (req, res) => {
    const album = await this.albumService.getAlbumWithSongs(req.params.id);
    res.json(album);
  });

  createAlbum = asyncHandler(async (req, res) => {
    const newAlbum = await this.albumService.createAlbum(req.body);
    res.status(201).json(newAlbum);
  });

  updateAlbum = asyncHandler(async (req, res) => {
    const updatedAlbum = await this.albumService.updateAlbum(req.params.id, req.body);
    res.json(updatedAlbum);
  });

  deleteAlbum = asyncHandler(async (req, res) => {
    await this.albumService.deleteAlbum(req.params.id);
    res.status(204).send();
  });

  getAlbumsByArtist = asyncHandler(async (req, res) => {
    const albums = await this.albumService.getAlbumsByArtist(req.params.artistId);
    res.json(albums);
}); }