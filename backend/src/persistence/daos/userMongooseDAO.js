import { IUserDAO } from '../../interfaces/daos/iUserDAO.js';

export class UserMongooseDAO extends IUserDAO {
  constructor(userModel) {
    super();
    this.model = userModel;
  }

  async findAll(filter = {}) {
    return await this.model.find(filter);
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async findByEmail(email) {
    return await this.model.findOne({ email });
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