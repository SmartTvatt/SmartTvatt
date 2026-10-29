import Booking from '../models/Booking.js';
import {
  isTimeSlotAvailable,
  loadWeeklySchedule,
} from '../services/timeSlotService.js';

// Godkänner bara riktiga datum i formatet YYYY-MM-DD, utan tidszonsförskjutning.
const isDateOnly = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

// Översätter unika databasindex till tydliga konflikter för användaren.
const duplicateKeyResponse = (error, res) => {
  if (error.code !== 11000) return false;

  if (error.keyPattern?.user) {
    res.status(409).json({ message: 'Du har redan en aktiv bokning.' });
  } else {
    res.status(409).json({ message: 'Den här tiden är redan bokad.' });
  }
  return true;
};

// Hämtar bokade tider för den valda veckan utan att exponera användaruppgifter.
export const getBookings = async (req, res) => {
  try {
    const { weekStart } = req.query;
    if (!isDateOnly(weekStart)) {
      return res.status(400).json({ message: 'Ange veckans startdatum i formatet ÅÅÅÅ-MM-DD.' });
    }

    // Ett halvöppet intervall fångar hela veckan utan att ta med nästa måndag.
    const start = new Date(`${weekStart}T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 7);

    const bookings = await Booking.find({
      date: { $gte: start, $lt: end },
      status: 'aktiv',
    }).select('date time location');

    res.json(bookings);
  } catch (error) {
    console.error('Fel vid hämtning av bokade tider:', error.message);
    res.status(500).json({ message: 'Kunde inte hämta bokade tider.' });
  }
};

// Hämtar den inloggade användarens aktiva bokning.
export const getMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      user: req.user.id,
      status: 'aktiv',
    });

    res.json(booking);
  } catch (error) {
    console.error('Fel vid hämtning av användarens bokning:', error.message);
    res.status(500).json({ message: 'Kunde inte hämta din bokning.' });
  }
};

// Skapar en ny bokning åt den inloggade användaren.
export const createBooking = async (req, res) => {
  try {
    const { date, time, location } = req.body ?? {};

    if (!isDateOnly(date) || typeof time !== 'string' || !time.trim() ||
        typeof location !== 'string' || !location.trim()) {
      return res.status(400).json({ message: 'Datum, tid och plats måste anges.' });
    }

    const dateValue = new Date(`${date}T00:00:00.000Z`);
    const schedule = await loadWeeklySchedule();
    if (!isTimeSlotAvailable(schedule, dateValue, time)) {
      return res.status(400).json({ message: 'Den valda tiden är inte bokningsbar den dagen.' });
    }

    // Ägaren hämtas från den verifierade JWT:n, inte från klientens request.
    const booking = await Booking.create({
      user: req.user.id,
      date: dateValue,
      time: time.trim(),
      location: location.trim(),
    });

    res.status(201).json(booking);
  } catch (error) {
    if (duplicateKeyResponse(error, res)) return;
    console.error('Fel vid skapande av bokning:', error.message);
    res.status(500).json({ message: 'Kunde inte spara bokningen.' });
  }
};

// Avbokar bara en aktiv bokning som tillhör den inloggade användaren.
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
        status: 'aktiv',
      },
      // Statusändring bevarar bokningshistoriken och frigör tiden.
      { status: 'avbokad' },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Den aktiva bokningen hittades inte.' });
    }

    res.json({ message: 'Bokningen har avbokats.', booking });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Ogiltigt boknings-id.' });
    }
    console.error('Fel vid avbokning:', error.message);
    res.status(500).json({ message: 'Kunde inte avboka tiden.' });
  }
};