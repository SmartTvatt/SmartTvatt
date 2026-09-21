const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ange namn'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Ange e-postadress'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Ange lösenord'],
      minlength: 6,
    },
    apartmentNumber: {
      type: String,
      required: [true, 'Ange lägenhetsnummer'],
    },
    role: {
      type: String,
      enum: ['Boende', 'Admin'],
      default: 'Boende',
    },
  },
  {
    timestamps: true, // Skapar createdAt och updatedAt automatiskt
  }
);

// Hasha lösenordet innan det sparas i databasen.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Metod för att jämföra lösenord vid inloggning.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);