import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: String, default: 'general' } 
});

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;