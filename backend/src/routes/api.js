import express from 'express';

import { ArtistController } from '../controllers/artistController.js';
import { SongController } from '../controllers/songController.js';
import { UserController } from '../controllers/userController.js';
import { AlbumController } from '../controllers/albumController.js';
import { PlaylistController } from '../controllers/playlistController.js';
import { connectToDatabase } from '../config/db.js';

import { createAuthRouter } from './authRoutes.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { isArtistOwner } from '../middlewares/artistAuthMiddleware.js';

const router = express.Router();

await connectToDatabase();

const artistController = new ArtistController();
const songController = new SongController();
const userController = new UserController();
const albumController = new AlbumController();
const playlistController = new PlaylistController();

const authRouter = createAuthRouter(userController);
router.use('/auth', authRouter);

router.get('/', (req, res) => {
  res.json({
    exampleEndpoints: {
      artists: [
        'GET /artists',
        'GET /artist/:id',
        '...'
      ],
      users: [
        'GET /user/:ownerId/playlists',
        '...'
      ],
      albums: [
        'GET /artist/:artistId/albums',
        '...'
      ],
      playlists: [
        'GET /me/playlists',
        '...'
] } }); });

router.get('/artists', artistController.getAllArtists.bind(artistController));
router.get('/artist/:id', artistController.getArtistById.bind(artistController));
router.post('/artists', protect, admin, artistController.createArtist.bind(artistController));
router.put('/artist/:id', protect, admin, artistController.updateArtist.bind(artistController));
router.delete('/artist/:id', protect, admin, artistController.deleteArtist.bind(artistController));
router.put('/artist/song/:id', protect, isArtistOwner, songController.updateSong.bind(songController));
router.put('/artist/album/:id', protect, isArtistOwner, albumController.updateAlbum.bind(albumController));
router.put('/artist/profile/:id', protect, isArtistOwner, artistController.updateArtist.bind(artistController));

router.get('/songs', songController.getAllSongs.bind(songController));
router.get('/song/:id', songController.getSongById.bind(songController));
router.post('/song/:id/play', songController.incrementPlay.bind(songController));
router.post('/songs', protect, admin, songController.createSong.bind(songController));
router.put('/song/:id', protect, admin, songController.updateSong.bind(songController));
router.delete('/song/:id', protect, admin, songController.deleteSong.bind(songController));

router.get('/users', protect, admin, userController.getAllUsers.bind(userController));
router.get('/user/:id', protect, admin, userController.getUserById.bind(userController));
router.put('/user/:id', protect, admin, userController.updateUser.bind(userController));
router.delete('/user/:id', protect, admin, userController.deleteUser.bind(userController));

router.get('/albums', albumController.getAllAlbums.bind(albumController));
router.get('/album/:id', albumController.getAlbumById.bind(albumController));
router.get('/artist/:artistId/albums', albumController.getAlbumsByArtist.bind(albumController));
router.post('/albums', protect, admin, albumController.createAlbum.bind(albumController));
router.put('/album/:id', protect, admin, albumController.updateAlbum.bind(albumController));
router.delete('/album/:id', protect, admin, albumController.deleteAlbum.bind(albumController));

router.get('/playlists', playlistController.getAllPlaylists.bind(playlistController));
router.get('/playlist/:id', playlistController.getPlaylistById.bind(playlistController));
router.get('/user/:ownerId/playlists', playlistController.getPlaylistsByOwner.bind(playlistController));
router.get('/me/playlists', protect, playlistController.getMyPlaylists.bind(playlistController));
router.post('/playlists', protect, playlistController.createPlaylist.bind(playlistController));
router.put('/playlist/:id', protect, playlistController.updatePlaylist.bind(playlistController));
router.delete('/playlist/:id', protect, playlistController.deletePlaylist.bind(playlistController));
router.post('/playlist/:id/song/:songId', protect, playlistController.addSongToPlaylist.bind(playlistController));
router.delete('/playlist/:id/song/:songId', protect, playlistController.removeSongFromPlaylist.bind(playlistController));

export default router;