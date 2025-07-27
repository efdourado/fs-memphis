import { IUserController } from './interfaces/iUserController.js';
import asyncHandler from '../middlewares/asyncHandler.js';

export class UserController extends IUserController {
  constructor(userService) {
    super();
    this.userService = userService;
  }

  registerUser = asyncHandler(async (req, res) => {
    const result = await this.userService.registerUser(req.body);
    res.status(201).json(result);
  });

  loginUser = asyncHandler(async (req, res) => {
    const result = await this.userService.loginUser(req.body);
    res.json(result);
  });
  
  getCurrentUser = asyncHandler(async (req, res) => {
    const user = await this.userService.getUserById(req.user.id);
    res.json(user);
  });

  getAllUsers = asyncHandler(async (req, res) => {
    const users = await this.userService.getAllUsers();
    res.json(users);
  });

  getUserById = asyncHandler(async (req, res) => {
    const user = await this.userService.getUserById(req.params.id);
    res.json(user);
  });
  
  updateUser = asyncHandler(async (req, res) => {
    const updatedUser = await this.userService.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  });
  
  deleteUser = asyncHandler(async (req, res) => {
    await this.userService.deleteUser(req.params.id);
    res.status(204).send();
  });

  getAllArtists = asyncHandler(async (req, res) => {
    const artists = await this.userService.getAllArtists();
    res.json(artists);
  });

  getArtistProfileById = asyncHandler(async (req, res) => {
      const artist = await this.userService.getArtistProfileById(req.params.id);
      res.json(artist);
}); }