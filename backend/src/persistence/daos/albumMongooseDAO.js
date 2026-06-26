export class AlbumMongooseDAO {
  constructor(albumModel) {
    this.model = albumModel;
  }

  async findAll() {
    return await this.model.find().populate('artist', 'name profilePic isArtist artistProfile');
  }

  async findById(id) {
    return await this.model.findById(id).populate('artist', 'name profilePic isArtist artistProfile');
  }

  async findByArtist(artistId) {
    return await this.model.find({ artist: artistId }).populate('artist', 'name profilePic isArtist artistProfile');
  }

  async create(albumDTO) {
    return await this.model.create(albumDTO);
  }

  async updateById(id, albumDTO) {
    return await this.model.findByIdAndUpdate(id, albumDTO, { new: true });
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
} }
