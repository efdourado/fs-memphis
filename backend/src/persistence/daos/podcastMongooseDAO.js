import PodcastModel from "../models/podcastModel.js";

export class PodcastMongooseDAO {
  constructor() {
    this.model = PodcastModel;
  }

  async findAll() {
    return await this.model.find().sort({ createdAt: -1 }).lean();
  }

  async findById(id) {
    return await this.model
      .findById(id)
      .populate("relatedArtists", "name profilePic")
      .lean();
  }

  async create(podcastDTO) {
    return await this.model.create(podcastDTO);
  }

  async updateById(id, podcastDTO) {
    return await this.model.findByIdAndUpdate(id, podcastDTO, { new: true });
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
} }