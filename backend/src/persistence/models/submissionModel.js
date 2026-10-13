import mongoose from 'mongoose';

// A song proposed for the Unheard room, told by the person who made it.
// Nothing here is published until someone reviews it.
const submissionSchema = new mongoose.Schema({
  artist: { type: String, required: true, trim: true, maxlength: 120 },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  link: { type: String, required: true, trim: true, maxlength: 300 },
  contact: { type: String, trim: true, maxlength: 160, default: '' },
  story: { type: String, required: true, trim: true, maxlength: 4000 },
  status: { type: String, enum: ['new', 'reading', 'accepted', 'declined'], default: 'new' },
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);
