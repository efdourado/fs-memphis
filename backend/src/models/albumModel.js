import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverImage: { type: String, default: '' },
  releaseDate: { type: Date, required: true },
  genre: { type: [String], required: true },
  type: {
    type: String,
    enum: ['album', 'single', 'ep', 'compilation'],
    default: 'album'
  },
  totalPlays: { type: Number, default: 0 },
  isExplicit: { type: Boolean, default: false },
  copyright: { type: String, default: '' },
  label: { type: String, default: '' }
}, { timestamps: true });

const Album = mongoose.model('Album', albumSchema);

export class AlbumModel {
  async findAll() {
    return await Album.find().populate('artist');
  }
  
  async findById(id) {
    return await Album.findById(id).populate('artist');
  }

  async findByArtist(artistId) {
    return await Album.find({ artist: artistId }).populate('artist');
  } 

  async create(albumData) {
    const newAlbumInstance = new Album(albumData);
    return await newAlbumInstance.save();
  }
  
  async updateById(id, updateData) {
    return await Album.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return await Album.findByIdAndDelete(id);
} }

export default Album;