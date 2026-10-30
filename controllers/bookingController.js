import Booking from '../models/Booking.js';
import {
  isTimeSlotAvailable,
  loadWeeklySchedule,
} from '../services/timeSlotService.js';

const isDateOnly = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const duplicateKeyResponse = (error, res) => {
  if (error.code !== 11000) return false;

  if (error.keyPattern?.user)             // Regel 1 bröts: personen har redan en aktiv bokning.
  {
    res.status(409).json({ message: 'Du har redan en aktiv bokning.' });
  } 
  else 
  {                                         // Regel 2 bröts: tiden är redan bokad av någon annan.
    res.status(409).json({ message: 'Den här tiden är redan bokad.' });
  }
  return true;
};

//---------------------------------------------------------------------------------------------------
// Hämtar bokade tider för den valda veckan utan att exponera användaruppgifter.
export const getBookings = async (req, res) => {
  try 
  {
    const { weekStart } = req.query;
    if (!isDateOnly(weekStart)) 
    {
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
  } 
  catch (error) 
  {
    console.error('Fel vid hämtning av bokade tider:', error.message);
    res.status(500).json({ message: 'Kunde inte hämta bokade tider.' });
  }
};

//---------------------------------------------------------------------------------------------------
// Hämtar Min Booking.
// Dashboarden anropar den här för att visa den inloggades bokning.
export const getMyBooking = async (req, res) => {
  try 
  {             // Hitta EN bokning där användaren är den inloggade OCH status är aktiv.
    const booking = await Booking.findOne({
      user: req.user.id,
      status: 'aktiv',
    });

    // Skicka tillbaka bokningen
    res.json(booking);
  }                     //Finns ingen ? -> skickas null.
  catch (error) 
  {
    console.error('Fel vid hämtning av användarens bokning:', error.message);
    res.status(500).json({ message: 'Kunde inte hämta din bokning.' });
  }
};

//---------------------------------------------------------------------------------------------------
// Skapar BOKNING 
export const createBooking = async (req, res) => {
  try 
  {     // Plocka ut det frontend skickade med.
        // "?? {}" = finns ingen body, använd ett tomt objekt så det inte kraschar.
    const { date, time, location } = req.body ?? {};

 // Kontroll: datum måste vara rätt, tid och plats får inte vara tomma.
     // .trim() tar bort mellanslag i början och slutet.

    if (!isDateOnly(date) || typeof time !== 'string' || !time.trim() ||
        typeof location !== 'string' || !location.trim()) {
      return res.status(400).json({ message: 'Datum, tid och plats måste anges.' });
    }

    // Räkna om datumet och kontrollera att tiden finns i veckoschemat.
    const dateValue = new Date(`${date}T00:00:00.000Z`);
    const schedule = await loadWeeklySchedule();
    if (!isTimeSlotAvailable(schedule, dateValue, time)) {
      return res.status(400).json({ message: 'Den valda tiden är inte bokningsbar den dagen.' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      date: dateValue,
      time: time.trim(),
      location: location.trim(),
    });

  // 201 = "skapad". Skicka tillbaka den nya bokningen.
    res.status(201).json(booking);
  } 
  catch (error) 
  {     // Bröts en regel i Booking.js? Då skickas ett tydligt 409-meddelande.
    if (duplicateKeyResponse(error, res)) return;
    console.error('Fel vid skapande av bokning:', error.message);
    res.status(500).json({ message: 'Kunde inte spara bokningen.' });
  }
};

//---------------------------------------------------------------------------------------------------
//AVBOKA
export const cancelBooking = async (req, res) => {
  try 
  {    // Hitta bokningen och ändra den i ett steg.
    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,     // id:t från adressen, t.ex. /api/bookings/abc123
        user: req.user.id,      // måste vara MIN bokning
        status: 'aktiv',        // och fortfarande aktiv
      },
      { status: 'avbokad' },
      { new: true, runValidators: true }       // new: true = skicka tillbaka den uppdaterade versionen.
    );                                         // runValidators: true = kolla reglerna i mallen (t.ex. enum).

    // Hittades ingen bokning? 404 = "hittades inte".
    if (!booking) 
    {
      return res.status(404).json({ message: 'Den aktiva bokningen hittades inte.' });
    }

    res.json({ message: 'Bokningen har avbokats.', booking });
  } 
  catch (error) 
  {
    // CastError = id:t har fel format
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Ogiltigt boknings-id.' });
    }
    console.error('Fel vid avbokning:', error.message);
    res.status(500).json({ message: 'Kunde inte avboka tiden.' });
  }
};