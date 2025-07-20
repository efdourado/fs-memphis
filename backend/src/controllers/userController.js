import { UserService } from '../services/userService.js';

export class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
       res.status(500).json({ error: error.message });
  } }

  async getAllArtists(req, res) {
    try {
      const artists = await this.userService.getAllArtists();
      res.json(artists);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async getUserById(req, res) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
  } }

  async getArtistProfileById(req, res) {
    try {
        const artistProfile = await this.userService.getArtistProfileById(req.params.id);
        res.json(artistProfile);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
  } }

  async updateUser(req, res) {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(error.statusCode || 400).json({ error: error.message });
  } }

  async deleteUser(req, res) {
    try {
      const user = await this.userService.deleteUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
  } }

  async registerUser(req, res) {
    try {
      const result = await this.userService.registerUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
  } }

  async loginUser(req, res) {
    try {
      const result = await this.userService.loginUser(req.body);
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
  } }

  async getCurrentUser(req, res) {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(404).json({ message: 'User not found' });
  } }


  async createUser(req, res) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
}