import mongoose from 'mongoose';

// Beskriver bokningens ägare, tid, plats och status i MongoDB.
const bookingSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'aktiv',
  },
});

export default mongoose.model('Booking', bookingSchema);