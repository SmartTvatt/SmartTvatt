import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js'; ///
import Booking from './models/Booking.js';
import messageRoutes from './routes/messageRoutes.js';
import timeslotRoutes from './routes/timeslotRoutes.js';
import { loadWeeklySchedule } from './services/timeSlotService.js';

// Läs miljövariablerna innan databasanslutningen och servern använder dem.
dotenv.config();
await connectDB();
// Skapa/verifiera unika bokningsindex innan API:t börjar ta emot anrop.
await Booking.init();
// Skapa standardschemat första gången; befintliga schemainställningar bevaras.
await loadWeeklySchedule();

const app = express();

// Middleware
app.use(cors());
// Gör JSON-data i inkommande API-anrop tillgänglig via req.body.
app.use(express.json());

// Prefixet här kombineras med varje rutas lokala sökväg, till exempel /api/auth/login.
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes); ///
app.use('/api/messages', messageRoutes);
app.use('/api/timeslots', timeslotRoutes);

// Test-route
app.get('/', (req, res) => {
  res.send('SmartTvätt API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
  });
