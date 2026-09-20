const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importera och koppla authRoutes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Test-route
app.get('/', (req, res) => {
  res.send('SmartTvätt API is running...');
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Ansluten till MongoDB!');
    app.listen(PORT, () => {
      console.log(`Servern körs på http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Fel vid anslutning till MongoDB:', err.message);
  });