import { IUserController } from '../interfaces/controllers/iUserController.js';
import { UserDTO } from '../persistence/dtos/userDTO.js';
import { UserDAO } from '../persistence/daos/userDAO.js';
import { UserService } from '../services/userService.js';

const userDAO = new UserDAO();
const userService = new UserService();

export class UserController extends IUserController {
  constructor() {
    super();
  }

  async getAllUsers(req, res) {
    try {
      const users = await userDAO.findAll({ isAdmin: false, isArtist: false });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async registerUser(req, res) {
    try {
      const result = await userService.registerUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
  } }
  
  async loginUser(req, res) {
    try {
      const result = await userService.loginUser(req.body);
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
  } }

  async updateUser(req, res) {
    const userDTO = new UserDTO();
    userDTO.id = req.params.id;
    Object.assign(userDTO, req.body);

    try {
      const updatedUser = await userDAO.updateById(userDTO);
      res.json(updatedUser);
    } catch (error) {
      res.status(error.statusCode || 400).json({ error: error.message });
  } }
  
  async deleteUser(req, res) {
    const userDTO = new UserDTO();
    userDTO.id = req.params.id;

    try {
      await userService.deleteUser(userDTO.id);
      res.status(204).end();
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
  } }

  async getAllArtists(req, res) {
     try {
      const artists = await userDAO.findAll({ isArtist: true });
      res.json(artists);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async getUserById(req, res) {
    try {
      const user = await userDAO.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
  } }
  
  async getCurrentUser(req, res) {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(404).json({ message: 'User not found' });
} } }