import AlbumModel from './persistence/models/albumModel.js';
import PlaylistModel from './persistence/models/playlistModel.js';
import SongModel from './persistence/models/songModel.js';
import UserModel from './persistence/models/userModel.js';

import { AlbumMongooseDAO } from './persistence/daos/albumMongooseDAO.js';
import { PlaylistMongooseDAO } from './persistence/daos/playlistMongooseDAO.js';
import { SongMongooseDAO } from './persistence/daos/songMongooseDAO.js';
import { UserMongooseDAO } from './persistence/daos/userMongooseDAO.js';

const albumDAO = new AlbumMongooseDAO(AlbumModel);
const playlistDAO = new PlaylistMongooseDAO(PlaylistModel);
const songDAO = new SongMongooseDAO(SongModel);
const userDAO = new UserMongooseDAO(UserModel);

import { AlbumService } from './services/albumService.js';
import { PlaylistService } from './services/playlistService.js';
import { SongService } from './services/songService.js';
import { UserService } from './services/userService.js';

const albumService = new AlbumService(albumDAO, songDAO);
const playlistService = new PlaylistService(playlistDAO, songDAO);
const songService = new SongService(songDAO);
const userService = new UserService(userDAO, playlistDAO);

import { AlbumController } from './controllers/albumController.js';
import { PlaylistController } from './controllers/playlistController.js';
import { SongController } from './controllers/songController.js';
import { UserController } from './controllers/userController.js';
import { createAuthRouter } from './routes/authRoutes.js';

const albumController = new AlbumController(albumService);
const playlistController = new PlaylistController(playlistService);
const songController = new SongController(songService);
const userController = new UserController(userService);

const authRouter = createAuthRouter(userController);

export default {
  albumController,
  playlistController,
  songController,
  userController,
  authRouter
};