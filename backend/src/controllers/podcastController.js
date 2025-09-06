import asyncHandler from '../middlewares/asyncHandler.js';

export class PodcastController {
  constructor(podcastService) {
    this.podcastService = podcastService;
  }

  getAllPodcasts = asyncHandler(async (req, res) => {
    const podcasts = await this.podcastService.getAllPodcasts();
    res.json(podcasts);
  });

  getPodcastById = asyncHandler(async (req, res) => {
    const podcast = await this.podcastService.getPodcastById(req.params.id);
    res.json(podcast);
  });

  createPodcast = asyncHandler(async (req, res) => {
    const newPodcast = await this.podcastService.createPodcast(req.body);
    res.status(201).json(newPodcast);
  });

  updatePodcast = asyncHandler(async (req, res) => {
    const updatedPodcast = await this.podcastService.updatePodcast(req.params.id, req.body);
    res.json(updatedPodcast);
  });

  deletePodcast = asyncHandler(async (req, res) => {
    await this.podcastService.deletePodcast(req.params.id);
    res.status(204).send();
}); }