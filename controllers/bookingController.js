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

// Skapar en ny bokning åt den inloggade användaren.
export const createBooking = async (req, res) => {
  try {
    const { date, time, location } = req.body;

    const booking = await Booking.create({
      user: req.user.id,
      date,
      time,
      location,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};