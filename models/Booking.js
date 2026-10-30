import mongoose from 'mongoose';                        // Mongoose är verktyget vi använder för prata med MongoDB

// Beskriver bokningens ägare, tid, plats och status i MongoDB.
const bookingSchema = new mongoose.Schema({           // Ett schema är en mall. Den bestämmer hur en bokning ser ut i databasen
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
    enum: ['aktiv', 'avbokad'],             // enum = status får BARA vara ett av de här två orden.
    default: 'aktiv',
  },
});

//index= en regel som databasen själv kontrollerar

bookingSchema.index(                            // Regel1: en person får bara ha EN aktiv bokning
  { user: 1 },
  { unique: true, partialFilterExpression: { status: 'aktiv' } }
);
bookingSchema.index(                            // Regel2: samma dag,tid och plats får bara bokas EN gång
  { date: 1, time: 1, location: 1 },
  { unique: true, partialFilterExpression: { status: 'aktiv' } }
);

export default mongoose.model('Booking', bookingSchema);
                                                  // Gör mallen klar och tillgänglig för andra filer tex. controllern