export class UserMongooseDAO {
  constructor(userModel) {
    this.model = userModel;
  }

  async findAll(filter = {}) {
    return await this.model.find(filter);
  }

  async findArtistProfileById(id) {
    return await this.model.findById(id).populate('topSongs').populate('albums').lean();
  }

  async findById(id) {
    return await this.model.findById(id).select('-password');
  }

  async findByIdWithLikedSongsPopulated(id) {
    return await this.model
      .findById(id)
      .select('-password')
      .populate({
        path: 'likedSongs',
        populate: [
          { path: 'artist', model: 'User', select: 'name profilePic' },
          { path: 'album', model: 'Album', select: 'title coverImage' },
        ],
      })
      .lean();
  }

  async findByIdWithTasteData(id) {
    return await this.model
      .findById(id)
      .select('-password')
      .populate({
        path: 'likedSongs',
        populate: [
          { path: 'artist', model: 'User', select: 'name profilePic' },
          { path: 'album', model: 'Album', select: 'title coverImage' },
        ],
      })
      .populate({
        path: 'recentlyPlayed.song',
        populate: [
          { path: 'artist', model: 'User', select: 'name profilePic' },
          { path: 'album', model: 'Album', select: 'title coverImage' },
        ],
      })
      .lean();
  }

  async findByEmail(email) {
    return await this.model.findOne({ email });
  }

  async findByEmailForAuth(email) {
    return await this.model.findOne({ email }).select('+password');
  }

  async create(userData) {
    return await this.model.create(userData);
  }

  async updateById(id, updateData) {
    return await this.model.findByIdAndUpdate(id, updateData, { new: true });
  }

  async addLikedSong(userId, songId) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $addToSet: { likedSongs: songId } },
      { new: true }
    ).select('-password');
  }

  async removeLikedSong(userId, songId) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $pull: { likedSongs: songId } },
      { new: true }
    ).select('-password');
  }

  async addFollowing(userId, targetUserId) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $addToSet: { following: targetUserId } },
      { new: true }
    ).select('-password');
  }

  async removeFollowing(userId, targetUserId) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $pull: { following: targetUserId } },
      { new: true }
    ).select('-password');
  }

  async addFollower(userId, followerId) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $addToSet: { followers: followerId } },
      { new: true }
    ).select('-password');
  }

  async removeFollower(userId, followerId) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $pull: { followers: followerId } },
      { new: true }
    ).select('-password');
  }

  async recordRecentlyPlayed(userId, songId) {
    await this.model.updateOne(
      { _id: userId },
      { $pull: { recentlyPlayed: { song: songId } } }
    );

    return await this.model.findByIdAndUpdate(
      userId,
      {
        $push: {
          recentlyPlayed: {
            $each: [{ song: songId, playedAt: new Date() }],
            $position: 0,
            $slice: 100
          }
        }
      },
      { new: true }
    ).select('-password');
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
} }
