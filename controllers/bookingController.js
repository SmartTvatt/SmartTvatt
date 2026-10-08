import Booking from '../models/Booking.js';

// Hämtar den inloggade användarens aktiva bokning.
export const getMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      user: req.user.id,
      status: 'aktiv',
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};