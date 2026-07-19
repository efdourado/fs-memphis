export class ListeningSessionMongooseDAO {
  constructor(model) {
    this.model = model;
  }

  create(data) { return this.model.create(data); }

  findByUser(userId) {
    return this.model.find({ user: userId }).sort({ occurredAt: -1 }).lean();
  }

  findAll() {
    return this.model.find().sort({ occurredAt: -1 }).populate('user', 'name email').lean();
  }

  findById(id) { return this.model.findById(id).lean(); }

  updateById(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  }

  deleteById(id) { return this.model.findByIdAndDelete(id).lean(); }
}
