import mongoose from 'mongoose';
import { IUserDAO } from '../../interfaces/daos/iUserDAO.js';
import UserModel from '../models/userModel.js';

export class UserDAO extends IUserDAO {
  constructor() {
    super();
  }

  async create(userDTO) {
    const newUser = await UserModel.create(userDTO.toJSON());
    return newUser;
  }

  async recovery() {
    const users = await UserModel.find();
    return users;
  }

  async update(userDTO) {
    const updatedUser = await UserModel.findByIdAndUpdate(userDTO.id, userDTO.toJSON(), { new: true });
    return updatedUser;
  }

  async delete(userDTO) {
    const deletedUser = await UserModel.findByIdAndDelete(userDTO.id);
    return deletedUser;
  }

  async search(userDTO) {
    const query = {};
    if (userDTO.email) query.email = userDTO.email;
    if (userDTO.name) query.name = userDTO.name;

    const users = await UserModel.find(query);
    return users;
} }