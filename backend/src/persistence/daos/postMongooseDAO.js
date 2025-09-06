import PostModel from '../models/postModel.js';

export class PostMongooseDAO {
  constructor() {
    this.model = PostModel;
  }

  async findAll() {
    return await this.model.find({ status: 'published' }).populate('author', 'name').lean();
  }

  async findBySlug(slug) {
    return await this.model.findOne({ slug }).populate('author', 'name').populate('relatedTracks').populate('relatedArtists').lean();
  }
  
  async create(postDTO) {
    return await this.model.create(postDTO);
  }

  async updateBySlug(slug, postDTO) {
    return await this.model.findOneAndUpdate({ slug }, postDTO, { new: true });
  }

  async deleteBySlug(slug) {
    return await this.model.findOneAndDelete({ slug });
} }