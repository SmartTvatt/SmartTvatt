import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';
import authRoutes from './routes/authRoutes.js';
// import bookingRoutes from './routes/bookingRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
// app.use('/api/bookings', bookingRoutes);

// Test-route
app.get('/', (req, res) => {
  res.send('SmartTvätt API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
  });
