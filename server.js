// växeln. Den startar servern och kopplar ihop allt
//hämtar verktygen :
import express from 'express';      //express: bygger servern
import dotenv from 'dotenv';        //dotenv: läser .env-filen (lösenordet till databasen)
import cors from 'cors';            //cors: tillåter frontend att prata med backends
import connectDB from './db.js';
                                                  //hämtar all raoutes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js'; ///min
import Booking from './models/Booking.js';
import messageRoutes from './routes/messageRoutes.js';
import timeslotRoutes from './routes/timeslotRoutes.js';
import { loadWeeklySchedule } from './services/timeSlotService.js';
import faultReportRoutes from './routes/faultReportRoutes.js';

// Läs miljövariablerna innan databasanslutningen och servern använder dem.
dotenv.config();    //läser .env, så MONGO_URI och JWT_SECRET finns tillgängliga.
await connectDB();    //kopplar upp mot databasen. await betyder “vänta tills det är klart innan du går vidare”.
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
app.use('/api/bookings', bookingRoutes); ///min
app.use('/api/messages', messageRoutes);
app.use('/api/timeslots', timeslotRoutes);
app.use('/api/fault-reports', faultReportRoutes);

// Test-route
app.get('/', (req, res) => {
  res.send('SmartTvätt API is running...');
});

//Startar servern på porten i .env, eller 5001 om ingen anges.
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
  });
