import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { spotifyLogin, spotifyCallback } from '../controllers/spotifyController.js';
import { registerUserValidator, loginUserValidator } from '../validators/userValidators.js';

export const createAuthRouter = (userController) => {
  const router = express.Router();

  router.post('/register', registerUserValidator, userController.registerUser);
  router.post('/login', loginUserValidator, userController.loginUser);

  router.get('/me', protect, userController.getCurrentUser);

  router.get('/spotify', spotifyLogin);
  router.get('/spotify/callback', spotifyCallback);

  return router;
};