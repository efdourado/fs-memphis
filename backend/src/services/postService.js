import AppError from "./appError.js";

export class PostService {
  constructor(postDAO) {
    this.postDAO = postDAO;
  }

  _createSlug(title) {
    return title
      .toLowerCase()
      .split(" ")
      .join("-")
      .replace(/[^\w-]+/g, "");
  }

  async getAllPosts() {
    return this.postDAO.findAll();
  }

  async getPostBySlug(slug) {
    const post = await this.postDAO.findBySlug(slug);
    if (!post) {
      throw new AppError("Post not found", 404);
    }
    return post;
  }

  async createPost(postData) {
    postData.slug = this._createSlug(postData.title);
    return this.postDAO.create(postData);
  }

  async updatePost(slug, updateData) {
    if (updateData.title) {
      updateData.slug = this._createSlug(updateData.title);
    }
    const post = await this.postDAO.updateBySlug(slug, updateData);
    if (!post) {
      throw new AppError("Post not found to update", 404);
    }
    return post;
  }

  async deletePost(slug) {
    const post = await this.postDAO.deleteBySlug(slug);
    if (!post) {
      throw new AppError("Post not found to delete", 404);
    }
    return post;
} }