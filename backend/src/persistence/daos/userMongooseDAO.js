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

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
} }