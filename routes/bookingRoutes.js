import express from 'express';
import { getMyBooking } from '../controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Returnerar den aktiva bokningen för den autentiserade användaren.
router.get('/mine', authMiddleware, getMyBooking);

export default router;
