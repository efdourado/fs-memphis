import UserModel from '../persistence/models/userModel.js';
import SongModel from '../persistence/models/songModel.js';
import AlbumModel from '../persistence/models/albumModel.js';
import AppError from './appError.js';

export class SearchService {
  async search(query) {
    if (!query) {
      throw new AppError('Query parameter is required', 400);
    }

    const searchRegex = new RegExp(query, 'i');

    const artists = await UserModel.find({ name: searchRegex, isArtist: true }).limit(10).lean();
    const albums = await AlbumModel.find({ title: searchRegex }).populate('artist').limit(10).lean();
    const songs = await SongModel.find({ title: searchRegex }).populate('artist album').limit(10).lean();

    return { artists, albums, songs };
} }