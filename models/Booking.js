import mongoose from 'mongoose';

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
    enum: ['aktiv', 'avbokad'],
    default: 'aktiv',
  },
});

bookingSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { status: 'aktiv' } }
);
bookingSchema.index(
  { date: 1, time: 1, location: 1 },
  { unique: true, partialFilterExpression: { status: 'aktiv' } }
);

export default mongoose.model('Booking', bookingSchema);