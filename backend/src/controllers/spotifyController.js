import axios from "axios";
import querystring from "querystring";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

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
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
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

    res.redirect(`http://localhost:5173/auth/callback?token=${appToken}`);
  } catch (error) {
    console.error(
      "Error during Spotify callback:",
      error.response ? error.response.data : error.message
    );
    res.redirect("/login?error=spotify_auth_failed");
} };