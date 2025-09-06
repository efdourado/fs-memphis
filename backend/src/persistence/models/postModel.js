import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subtitle: { type: String },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['analysis', 'story', 'tutorial', 'podcast_notes', 'news'],
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  coverImage: { type: String },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  
  linkedItems: [{
    itemType: { type: String, required: true, enum: ['Song', 'Album', 'Playlist', 'User'] },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'linkedItems.itemType' }
}], }, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;