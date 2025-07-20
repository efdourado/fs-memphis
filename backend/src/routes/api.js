import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';

import { UserController } from '../controllers/userController.js';
import { SongController } from '../controllers/songController.js';
import { AlbumController } from '../controllers/albumController.js';
import { PlaylistController } from '../controllers/playlistController.js';
import { connectToDatabase } from '../config/db.js';
import { createAuthRouter } from './authRoutes.js';

const router = express.Router();

await connectToDatabase();

const userController = new UserController();
const songController = new SongController();
const albumController = new AlbumController();
const playlistController = new PlaylistController();

const authRouter = createAuthRouter(userController);
router.use('/auth', authRouter);

router.get('/artists', userController.getAllArtists.bind(userController));
router.get('/artist/:id', userController.getArtistProfileById.bind(userController));

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

router.get('/songs', songController.getAllSongs.bind(songController));
router.get('/song/:id', songController.getSongById.bind(songController));
router.post('/song/:id/play', songController.incrementPlay.bind(songController));
router.post('/songs', protect, admin, songController.createSong.bind(songController));
router.put('/song/:id', protect, admin, songController.updateSong.bind(songController));
router.delete('/song/:id', protect, admin, songController.deleteSong.bind(songController));

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