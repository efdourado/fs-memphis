export class PlayEventMongooseDAO {
  constructor(playEventModel) {
    this.model = playEventModel;
  }

  async create(playEventDTO) {
    return await this.model.create(playEventDTO);
  }

  async findRecentByUser(userId, limit = 100) {
    return await this.model
      .find({ user: userId })
      .sort({ startedAt: -1 })
      .limit(limit)
      .populate({
        path: "song",
        populate: [
          { path: "artist", model: "User", select: "name profilePic isArtist artistProfile" },
          { path: "album", model: "Album", select: "title coverImage" }
        ]
      })
      .lean();
  }
}
