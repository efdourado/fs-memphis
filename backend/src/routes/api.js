import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { connectToDatabase } from '../config/db.js';
import container from '../container.js';

import { createAlbumValidator, updateAlbumValidator } from '../validators/albumValidators.js';
import { createPlaylistValidator, updatePlaylistValidator } from '../validators/playlistValidators.js';
import { createSongValidator, updateSongValidator } from '../validators/songValidators.js';
import { updateUserValidator, createUserValidator } from '../validators/userValidators.js';

const router = express.Router();

await connectToDatabase();

const { 
  userController, 
  songController, 
  albumController, 
  playlistController, 
  authRouter 
} = container;

router.use('/auth', authRouter);


router.get('/artists', userController.getAllArtists);
router.get('/artist/:id', userController.getArtistProfileById);
router.get('/artist/:artistId/albums', albumController.getAlbumsByArtist);


router.route('/users')
    .get(protect, admin, userController.getAllUsers)
    .post(protect, admin, createUserValidator, userController.createUser);

router.route('/user/:id')
    .get(protect, admin, userController.getUserById)
    .put(protect, admin, updateUserValidator, userController.updateUser)
    .delete(protect, admin, userController.deleteUser);


router.route('/albums')
    .get(albumController.getAllAlbums)
    .post(protect, admin, createAlbumValidator, albumController.createAlbum);

router.route('/album/:id')
    .get(albumController.getAlbumById)
    .put(protect, admin, updateAlbumValidator, albumController.updateAlbum)
    .delete(protect, admin, albumController.deleteAlbum);


router.route('/songs')
    .get(songController.getAllSongs)
    .post(protect, admin, createSongValidator, songController.createSong);

router.route('/song/:id')
    .get(songController.getSongById)
    .put(protect, admin, updateSongValidator, songController.updateSong)
    .delete(protect, admin, songController.deleteSong);

router.post('/song/:id/play', songController.incrementPlay);


router.route('/playlists')
  .get(playlistController.getAllPlaylists)
  .post(protect, createPlaylistValidator, playlistController.createPlaylist);

router.route('/playlist/:id')
  .get(playlistController.getPlaylistById)
  .put(protect, updatePlaylistValidator, playlistController.updatePlaylist)
  .delete(protect, playlistController.deletePlaylist);

router.get('/user/:ownerId/playlists', playlistController.getPlaylistsByOwner);
router.get('/me/playlists', protect, playlistController.getMyPlaylists);
router.post('/playlist/:id/song/:songId', protect, playlistController.addSongToPlaylist);
router.delete('/playlist/:id/song/:songId', protect, playlistController.removeSongFromPlaylist);

export default router;