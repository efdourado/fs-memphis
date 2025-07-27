import jwt from 'jsonwebtoken';
import { UserDAO } from '../persistence/daos/userDAO.js';
import Playlist from '../persistence/models/playlistModel.js';
import User from '../persistence/models/userModel.js';

export class UserService {
  constructor() {
    this.userDAO = new UserDAO();
  }

  _generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  }); }

  async getAllUsers() {
    return this.userDAO.findAll();
  }

  async getUserById(id) {
    return this.userDAO.findById(id);
  }

  async getAllArtists() {
    return this.userDAO.findAll({ isArtist: true });
  }

  async getArtistProfileById(id) {
    const artist = await User.findById(id)
      .populate('topSongs')
      .populate('albums')
      .lean();

    if (!artist || !artist.isArtist) {
      const err = new Error('Artist not found');
      err.statusCode = 404;
      throw err;
    }
    return artist;
  }

  async updateUser(id, updateData) {
    if (updateData.password) {
      const err = new Error("Password cannot be updated through this route.");
      err.statusCode = 400;
      throw err;
    }
    return this.userDAO.updateById(id, updateData);
  }

  async deleteUser(id) {
    await Playlist.deleteMany({ owner: id });
    return this.userDAO.deleteById(id);
  }

  async registerUser({ name, email, password }) {
    if (!name || !email || !password) {
      const err = new Error('Please add all fields');
      err.statusCode = 400;
      throw err;
    }
    
    const userExistsByEmail = await this.userDAO.findByEmail(email);
    if (userExistsByEmail) {
      const err = new Error('User with this email already exists');
      err.statusCode = 400;
      throw err;
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
      const err = new Error('Please provide email and password');
      err.statusCode = 400;
      throw err;
    }
    
    const user = await this.userDAO.findByEmail(email);

    if (user && (await user.comparePassword(password))) {
      const userObject = user.toObject();
      delete userObject.password;

      return {
        ...userObject,
        token: this._generateToken(user._id),
      };
    } else {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
  } }

  async createUser(userData) {
    if (!userData.name || !userData.email) {
      const err = new Error('Name and email are required.');
      err.statusCode = 400;
      throw err;
    }

    const userExists = await this.userDAO.findByEmail(userData.email);
    if (userExists) {
      const err = new Error('User with this email already exists.');
      err.statusCode = 409;
      throw err;
    }

    if (!userData.password) {
      userData.password = "default000";
    }

    return this.userDAO.create(userData);
} }