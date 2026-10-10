/* global process */
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Ansluten till MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Fel vid anslutning till MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;