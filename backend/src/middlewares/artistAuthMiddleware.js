import Song from "../persistence/models/songModel.js";
import Album from "../persistence/models/albumModel.js";
import User from "../persistence/models/userModel.js";

export const isArtistOwner = async (req, res, next) => {
  if (!req.user || !req.user.isArtist) {
    return res
      .status(403)
      .json({ message: "Access denied. User is not an artist." });
  }

  try {
    const userId = req.user._id;
    let resource;

    if (req.params.id) {
      if (req.baseUrl.includes("songs")) {
        resource = await Song.findById(req.params.id);
      } else if (req.baseUrl.includes("albums")) {
        resource = await Album.findById(req.params.id);
    } }

    if (req.params.id === userId.toString()) {
      return next();
    }

    if (resource && resource.artist.toString() === userId.toString()) {
      return next();
    }

    return res
      .status(403)
      .json({ message: "Access denied. You do not own this content." });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error during authorization.",
        error: error.message,
}); } };