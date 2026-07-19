export class InsightMongooseDAO {
  constructor(model) {
    this.model = model;
  }

  async replaceForUser(userId, insights) {
    const activeTypes = insights.map((insight) => insight.type);
    await this.model.deleteMany({ user: userId, period: 'all', type: { $nin: activeTypes } });
    await Promise.all(insights.map((insight) => this.model.findOneAndUpdate(
      { user: userId, period: 'all', type: insight.type },
      { ...insight, user: userId, period: 'all', generatedAt: new Date() },
      { upsert: true, new: true, runValidators: true },
    )));
    return this.model.find({ user: userId, period: 'all' }).sort({ type: 1 }).lean();
  }
}
