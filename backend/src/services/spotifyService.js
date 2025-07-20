// backend/src/services/spotifyService.js

import axios from "axios";
import querystring from "querystring";
import User from "../models/userModel.js";

const getNewAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Spotify refresh token is missing.");
  }
  try {
    const response = await axios({
      method: "post",
      // URL CORRETA para autenticação
      url: "https://accounts.spotify.com/api/token",
      data: querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
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
    });
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Could not refresh access token",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to refresh Spotify token.");
  }
};

export const getSpotifyApi = (userId, accessToken, refreshToken) => {
  const spotifyApi = axios.create({
    // URL BASE CORRETA para a API do Spotify
    baseURL: 'https://api.spotify.com/v1',
  });

  spotifyApi.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  spotifyApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          console.log("Access token expired. Refreshing...");
          const newAccessToken = await getNewAccessToken(refreshToken);

          await User.findByIdAndUpdate(userId, {
            spotifyAccessToken: newAccessToken,
          });

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return spotifyApi(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return spotifyApi;
};