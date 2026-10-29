import express from 'express';
import { getTimeSlots } from '../controllers/timeSlotApiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTimeSlots);

export default router;
