import express from 'express';
import {
  cancelBooking,
  createBooking,
  getBookings,
  getMyBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Schemat får bara aktiva bokningar för den efterfrågade veckan.
router.get('/', protect, getBookings);
// Returnerar den aktiva bokningen för den autentiserade användaren.
router.get('/mine', protect, getMyBooking);
// Skapa ny bokning (kräver att användaren är inloggad).
router.post('/', protect, createBooking);
// Avbokning ändrar status så historiken finns kvar i databasen.
router.delete('/:id', protect, cancelBooking);

export default router;