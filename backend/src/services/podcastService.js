import AppError from './appError.js';

export class PodcastService {
  constructor(podcastDAO) {
    this.podcastDAO = podcastDAO;
  }

  async getAllPodcasts() {
    return this.podcastDAO.findAll();
  }

  async getPodcastById(id) {
    const podcast = await this.podcastDAO.findById(id);
    if (!podcast) {
      throw new AppError('Podcast not found', 404);
    }
    return podcast;
  }

  async createPodcast(podcastData) {
    return this.podcastDAO.create(podcastData);
  }

  async updatePodcast(id, updateData) {
    const podcast = await this.podcastDAO.updateById(id, updateData);
    if (!podcast) {
        throw new AppError('Podcast not found to update', 404);
    }
    return podcast;
  }

  async deletePodcast(id) {
    const podcast = await this.podcastDAO.deleteById(id);
     if (!podcast) {
        throw new AppError('Podcast not found to delete', 404);
    }
    return podcast;
} }