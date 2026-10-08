const mongoose = require('mongoose');               //Hämtar in mongoose för att prata med MongoDB

const bookingSchema = new mongoose.Schema               //schema = mallen.
({
    user: {
        type: String,  //??
        required: true,           //reuired=obligatoriskt att fylla i detta fält
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
        default: 'aktiv',
            },
});   

module.exports = mongoose.model('Booking', bookingSchema);  // gör mallen tillgängligt så andra filer kan använda den
