const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
    // Fält för hantering av glömt lösenord.
    resetPasswordToken: String,
    resetPasswordExpire: Date,
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

// Metod för att generera och hasha återställningstoken för glömt lösenord.
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
  
    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Giltig i 10 minuter.
  
    return resetToken;
  };

module.exports = mongoose.model('User', userSchema);