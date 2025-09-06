import AppError from './appError.js';

export class TagService {
  constructor(tagDAO) {
    this.tagDAO = tagDAO;
  }

  _createSlug(name) {
    return name.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '');
  }

  async getAllTags() {
    return this.tagDAO.findAll();
  }

  async createTag(tagData) {
    tagData.slug = this._createSlug(tagData.name);
    return this.tagDAO.create(tagData);
  }

  async getContentByTag(slug) {
    const content = await this.tagDAO.findContentByTagSlug(slug);
    if (!content) {
      throw new AppError('No content found for this tag', 404);
    }
    return content;
} }