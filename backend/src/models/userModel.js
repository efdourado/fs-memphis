import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const artistSchema = new mongoose.Schema({
  description: { type: String, default: '' },
  verified: { type: Boolean, default: false },

  genres: { type: [String], default: [] },

  socials: {
    instagram: { type: String, default: "" },
    x: { type: String, default: "" },
    youtube: { type: String, default: "" },
    tiktok: { type: String, default: "" },
}, }, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },

  profilePic: { type: String, default: '' },
  
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  recentlyPlayed: [{
    song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
    playedAt: { type: Date, default: Date.now }
  }],

  isAdmin: { type: Boolean, default: false },
  isArtist: { type: Boolean, default: false },

  artistProfile: {
    type: artistSchema,
    default: null, 
  },

  spotifyId: { type: String, unique: true, sparse: true },
  spotifyAccessToken: { type: String },
  spotifyRefreshToken: { type: String },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('albums', {
  ref: 'Album',
  localField: '_id',
  foreignField: 'artist'
});

userSchema.virtual('topSongs', {
  ref: 'Song',
  localField: '_id',
  foreignField: 'artist',
  options: { sort: { plays: -1 }, limit: 10 }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.password.startsWith('spotify:')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.comparePassword = async function (enteredPassword) {
  if (this.password.startsWith('spotify:')) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export class UserModel {
  async findAll(filter = {}) {
    return await User.find(filter).select('-password');
  }

  async findById(id) {
    return await User.findById(id).select('-password');
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  }

  async deleteById(id) {
    return await User.findByIdAndDelete(id);
} }

export default User;