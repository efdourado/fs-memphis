import TagModel from '../models/tagModel.js';
import SongModel from '../models/songModel.js';
import PostModel from '../models/postModel.js';

export class TagMongooseDAO {
  constructor() {
    this.model = TagModel;
  }
  
  async findAll() {
    return await this.model.find().lean();
  }

  async create(tagDTO) {
    return await this.model.create(tagDTO);
  }
  
  async findContentByTagSlug(slug) {
    const tag = await this.model.findOne({ slug }).lean();
    if (!tag) return null;
    
    const songs = await SongModel.find({ tags: tag._id }).populate('artist album').lean();
    const posts = await PostModel.find({ tags: tag._id }).populate('author').lean();
    
    return { tag, songs, posts };
} }