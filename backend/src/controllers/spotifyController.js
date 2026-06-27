import axios from "axios";
import querystring from "querystring";
import jwt from "jsonwebtoken";
import User from "../persistence/models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../services/appError.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
}); };

export const spotifyLogin = (req, res) => {
  const scope =
    "user-read-private user-read-email playlist-read-private user-library-read";
  res.redirect("https://accounts.spotify.com/authorize?" + querystring.stringify({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
}) ); };

const spotifyTokenHeaders = () => ({
  Authorization:
    "Basic " +
    Buffer.from(
      process.env.SPOTIFY_CLIENT_ID +
        ":" +
        process.env.SPOTIFY_CLIENT_SECRET
    ).toString("base64"),
  "Content-Type": "application/x-www-form-urlencoded",
});

const refreshSpotifyAccessToken = async (user) => {
  if (!user.spotifyRefreshToken) {
    throw new AppError("Spotify account is not connected", 409);
  }

  const { data } = await axios.post(
    "https://accounts.spotify.com/api/token",
    querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: user.spotifyRefreshToken,
    }),
    { headers: spotifyTokenHeaders() }
  );

  user.spotifyAccessToken = data.access_token;
  if (data.refresh_token) {
    user.spotifyRefreshToken = data.refresh_token;
  }
  await user.save();

  return user.spotifyAccessToken;
};

const requestSpotify = async (user, options) => {
  if (!user.spotifyAccessToken) {
    throw new AppError("Spotify account is not connected", 409);
  }

  const requestWithToken = (accessToken) => axios({
    baseURL: "https://api.spotify.com/v1",
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  });

  try {
    return await requestWithToken(user.spotifyAccessToken);
  } catch (error) {
    if (error.response?.status !== 401) throw error;
    const refreshedToken = await refreshSpotifyAccessToken(user);
    return await requestWithToken(refreshedToken);
  }
};

const getConnectedSpotifyUser = async (userId) => {
  const user = await User.findById(userId).select("+spotifyAccessToken +spotifyRefreshToken");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (!user.spotifyId || !user.spotifyRefreshToken) {
    throw new AppError("Spotify account is not connected", 409);
  }
  return user;
};

const mapSpotifyTrack = (track) => ({
  id: track.id,
  uri: track.uri,
  name: track.name,
  durationMs: track.duration_ms,
  explicit: track.explicit,
  previewUrl: track.preview_url,
  popularity: track.popularity,
  externalUrl: track.external_urls?.spotify || "",
  album: {
    id: track.album?.id,
    name: track.album?.name,
    releaseDate: track.album?.release_date,
    image: track.album?.images?.[0]?.url || "",
    externalUrl: track.album?.external_urls?.spotify || "",
  },
  artists: (track.artists || []).map((artist) => ({
    id: artist.id,
    name: artist.name,
    externalUrl: artist.external_urls?.spotify || "",
  })),
});

export const spotifyCallback = async (req, res) => {
  const code = req.query.code || null;

  try {
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      method: "post",
      data: querystring.stringify({
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      headers: {
        ...spotifyTokenHeaders(),
      },
      json: true,
    };

    const tokenResponse = await axios(authOptions);
    const { access_token, refresh_token } = tokenResponse.data;

    const userProfileResponse = await axios.get(
      "https://api.spotify.com/v1/me",
      {
        headers: { Authorization: "Bearer " + access_token },
    } );

    const {
      id: spotifyId,
      display_name,
      email,
      images,
    } = userProfileResponse.data;

    let user = await User.findOne({ email: email });

    if (!user) {
      user = new User({
        name: display_name,
        email: email,
        password: `spotify:${spotifyId}`,
        profilePic: images?.[0]?.url || "",
        spotifyId: spotifyId,
        spotifyAccessToken: access_token,
        spotifyRefreshToken: refresh_token,
      });
      await user.save();
    } else {
      user.spotifyAccessToken = access_token;
      user.spotifyRefreshToken = refresh_token;
      await user.save();
    }

    const appToken = generateToken(user._id);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${appToken}`);
  } catch (error) {
    console.error(
      "Error during Spotify callback:",
      error.response ? error.response.data : error.message
    );
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?error=spotify_auth_failed`);
} };

export const getSpotifyStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+spotifyAccessToken +spotifyRefreshToken");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (!user.spotifyId || !user.spotifyRefreshToken) {
    return res.json({ connected: false });
  }

  const { data } = await requestSpotify(user, { method: "get", url: "/me" });

  res.json({
    connected: true,
    id: data.id,
    displayName: data.display_name,
    product: data.product,
    country: data.country,
    image: data.images?.[0]?.url || "",
    externalUrl: data.external_urls?.spotify || "",
  });
});

export const searchSpotifyTracks = asyncHandler(async (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (!query) {
    throw new AppError("Search query is required", 400);
  }

  const user = await getConnectedSpotifyUser(req.user._id);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 20);
  const offset = Math.max(Number(req.query.offset) || 0, 0);

  const { data } = await requestSpotify(user, {
    method: "get",
    url: "/search",
    params: {
      q: query,
      type: "track",
      limit,
      offset,
    },
  });

  res.json({
    query,
    total: data.tracks?.total || 0,
    items: (data.tracks?.items || []).map(mapSpotifyTrack),
  });
});
