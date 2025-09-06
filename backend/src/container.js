// Models
import AlbumModel from './persistence/models/albumModel.js';
import PlaylistModel from './persistence/models/playlistModel.js';
import SongModel from './persistence/models/songModel.js';
import UserModel from './persistence/models/userModel.js';
import PostModel from './persistence/models/postModel.js';
import TagModel from './persistence/models/tagModel.js';
import PodcastModel from './persistence/models/podcastModel.js';

// DAOs
import { AlbumMongooseDAO } from './persistence/daos/albumMongooseDAO.js';
import { PlaylistMongooseDAO } from './persistence/daos/playlistMongooseDAO.js';
import { SongMongooseDAO } from './persistence/daos/songMongooseDAO.js';
import { UserMongooseDAO } from './persistence/daos/userMongooseDAO.js';
import { PostMongooseDAO } from './persistence/daos/postMongooseDAO.js';
import { TagMongooseDAO } from './persistence/daos/tagMongooseDAO.js';
import { PodcastMongooseDAO } from './persistence/daos/podcastMongooseDAO.js';

const albumDAO = new AlbumMongooseDAO(AlbumModel);
const playlistDAO = new PlaylistMongooseDAO(PlaylistModel);
const songDAO = new SongMongooseDAO(SongModel);
const userDAO = new UserMongooseDAO(UserModel);
const postDAO = new PostMongooseDAO();
const tagDAO = new TagMongooseDAO();
const podcastDAO = new PodcastMongooseDAO();

// Services
import { AlbumService } from './services/albumService.js';
import { PlaylistService } from './services/playlistService.js';
import { SongService } from './services/songService.js';
import { UserService } from './services/userService.js';
import { SearchService } from './services/searchService.js';
import { PostService } from './services/postService.js';
import { TagService } from './services/tagService.js';
import { PodcastService } from './services/podcastService.js';

const albumService = new AlbumService(albumDAO, songDAO);
const playlistService = new PlaylistService(playlistDAO, songDAO);
const songService = new SongService(songDAO);
const userService = new UserService(userDAO, playlistDAO);
const searchService = new SearchService();
const postService = new PostService(postDAO);
const tagService = new TagService(tagDAO);
const podcastService = new PodcastService(podcastDAO);

// Controllers
import { AlbumController } from './controllers/albumController.js';
import { PlaylistController } from './controllers/playlistController.js';
import { SongController } from './controllers/songController.js';
import { UserController } from './controllers/userController.js';
import { SearchController } from './controllers/searchController.js';
import { PostController } from './controllers/postController.js';
import { TagController } from './controllers/tagController.js';
import { PodcastController } from './controllers/podcastController.js';
import { createAuthRouter } from './routes/authRoutes.js';

const albumController = new AlbumController(albumService);
const playlistController = new PlaylistController(playlistService);
const songController = new SongController(songService);
const userController = new UserController(userService);
const searchController = new SearchController(searchService);
const postController = new PostController(postService);
const tagController = new TagController(tagService);
const podcastController = new PodcastController(podcastService);

const authRouter = createAuthRouter(userController);

export default {
  albumController,
  playlistController,
  songController,
  userController,
  searchController,
  postController,
  tagController,
  podcastController,
  authRouter
};