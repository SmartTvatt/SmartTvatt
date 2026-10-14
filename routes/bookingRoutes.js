import express from 'express';
import { createBooking, getMyBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Skapa ny bokning (kräver att användaren är inloggad)
router.post('/', protect, createBooking);

// Returnerar den aktiva bokningen för den autentiserade användaren
router.get('/mine', protect, getMyBooking);

export default router;