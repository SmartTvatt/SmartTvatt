import mongoose from 'mongoose';

const WEEKDAY_KEYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const defaultIntervals = [
  { id: 'morning', start: '08:00', end: '12:00' },
  { id: 'afternoon', start: '12:00', end: '16:00' },
  { id: 'evening', start: '16:00', end: '20:00' },
];

const intervalSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    start: {
      type: String,
      required: true,
      match: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
    },
    end: {
      type: String,
      required: true,
      match: /^(?:(?:[01]\d|2[0-3]):[0-5]\d|24:00)$/,
    },
  },
  { _id: false }
);

const dayOverridesSchema = new mongoose.Schema(
  Object.fromEntries(
    WEEKDAY_KEYS.map((day) => [day, { type: [intervalSchema], default: undefined }])
  ),
  { _id: false }
);

const timeSlotSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'weekly' },
    intervals: { type: [intervalSchema], default: () => defaultIntervals },
    dayOverrides: { type: dayOverridesSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export { WEEKDAY_KEYS, defaultIntervals };
export default mongoose.model('TimeSlot', timeSlotSchema);