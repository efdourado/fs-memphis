import jwt from 'jsonwebtoken';
import AppError from './appError.js';

export class UserService {
  constructor(userDAO, playlistDAO) {
    this.userDAO = userDAO;
    this.playlistDAO = playlistDAO;
  }

  _generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  }); }

  async getAllUsers() {
    return this.userDAO.findAll({ isAdmin: false, isArtist: false });
  }

  async getUserById(id) {
    const user = await this.userDAO.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async getAllArtists() {
    return this.userDAO.findAll({ isArtist: true });
  }

  async getArtistProfileById(id) {
    const artist = await this.userDAO.findById(id)
      .populate('topSongs')
      .populate('albums')
      .lean();

    if (!artist || !artist.isArtist) {
      throw new AppError('Artist not found', 404);
    }
    return artist;
  }
  
  async registerUser({ name, email, password }) {
    if (!name || !email || !password) {
      throw new AppError('Please provide name, email, and password', 400);
    }
    
    const userExists = await this.userDAO.findByEmail(email);
    if (userExists) {
      throw new AppError('User with this email already exists', 409);
    }

    const user = await this.userDAO.create({ name, email, password });
    
    const userObject = user.toObject();
    delete userObject.password;
    
    return {
      ...userObject,
      token: this._generateToken(user._id),
  }; }

  async loginUser({ email, password }) {
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }
    
    const user = await this.userDAO.findByEmail(email).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }
    
    const userObject = user.toObject();
    delete userObject.password;

    return {
      ...userObject,
      token: this._generateToken(user._id),
  }; }

  async updateUser(id, updateData) {
    if (updateData.password) {
      throw new AppError("Password cannot be updated through this route.", 400);
    }
    const user = await this.userDAO.updateById(id, updateData);
     if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async deleteUser(id) {
    const user = await this.userDAO.findById(id);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    await this.playlistDAO.model.deleteMany({ owner: id });
    await this.userDAO.deleteById(id);
} }