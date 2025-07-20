import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getFeaturedPlaylists } from '../controllers/spotifyController.js';

const router = express.Router();

router.get('/featured-playlists', protect, getFeaturedPlaylists);

export default router;