import mongoose from "mongoose";

const playEventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  song: { type: mongoose.Schema.Types.ObjectId, ref: "Song", required: true, index: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album", index: true },
  context: {
    type: {
      type: String,
      enum: ["", "album", "playlist", "artist", "search", "recommendation", "shuffle", "library"],
      default: ""
    },
    id: { type: mongoose.Schema.Types.ObjectId },
    label: { type: String, default: "" }
  },
  source: {
    type: String,
    enum: ["web", "spotify", "import", "unknown"],
    default: "web"
  },
  activity: { type: String, default: "" },
  startedAt: { type: Date, default: Date.now, index: true },
  listenMs: { type: Number, default: 0 },
  progressMs: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  skipped: { type: Boolean, default: false }
}, { timestamps: true });

playEventSchema.index({ user: 1, startedAt: -1 });
playEventSchema.index({ song: 1, startedAt: -1 });

const PlayEvent = mongoose.model("PlayEvent", playEventSchema);

export default PlayEvent;
