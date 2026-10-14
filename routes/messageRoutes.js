import express from 'express';
import { getMyMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Skydda inkorgen och låt controllern läsa mottagarens id från req.user.
router.get('/mine', protect, getMyMessages);

export default router;