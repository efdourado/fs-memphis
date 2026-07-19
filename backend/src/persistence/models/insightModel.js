import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  period: { type: String, enum: ['all'], default: 'all' },
  type: { type: String, required: true },
  summary: { type: String, required: true },
  evidence: { type: mongoose.Schema.Types.Mixed, default: {} },
  generatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

insightSchema.index({ user: 1, period: 1, type: 1 }, { unique: true });

export default mongoose.model('Insight', insightSchema);
