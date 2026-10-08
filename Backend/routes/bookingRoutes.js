const express = require('express');
const router = express.Router();                            //en lite router som samlar ihop adressena som hör till bookning
const {getMyBooking} = require('../controllers/bookingController');

router.get('/mine', getMyBooking);                                  // när vi går till /mine så körs getMyBooking funktionen

module.exports=router;                                  // gör routern tillgänglig så server.js kan kopplar in den
