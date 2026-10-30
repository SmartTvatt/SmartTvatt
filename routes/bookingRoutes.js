//adresserna. Den kopplar en URL till rätt funktion i controllern.

//Hämtar Express, verktyget som bygger servern och dess adresser
import express from 'express';
import {    //Hämtar de fyra funktionerna från controllern som hanterar bokningar.
  cancelBooking,
  createBooking,
  getBookings,
  getMyBooking,
} from '../controllers/bookingController.js';

//Hämtar vakten (protect). Den kollar att man är inloggad innan funktionen får köras
import { protect } from '../middleware/authMiddleware.js';
// här Skapar vi en “router”, en liten samling adresser som hör till bokningar.
const router = express.Router();

// GET /api/bookings           hämtar veckans bokade tiders schema.
router.get('/', protect, getBookings);

//GET /api/bookings/mine        hämtar min bokning. Det är den här dashboard anropar.
router.get('/mine', protect, getMyBooking);

//POST /api/bookings            skapar en bokning.
router.post('/', protect, createBooking);

//DELETE /api/bookings/abc123    avbokar.
router.delete('/:id', protect, cancelBooking);

export default router;    //Gör routen tillgänglig för server.js.