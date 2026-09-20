const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Hjälpfunktion för att generera JWT-token.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc, Registrera ny användare
// @route, POST /api/auth/register
// @access, Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, apartmentNumber, role } = req.body;

    // Kontrollera om användaren redan finns
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'En användare med denna e-post finns redan' });
    }

    // Skapa ny användare (lösenordet hashas automatiskt i User.js pre-save hook).
    const user = await User.create({
      name,
      email,
      password,
      apartmentNumber,
      role: role || 'Boende',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        apartmentNumber: user.apartmentNumber,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Ogiltig användardata' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc, Logga in användare
// @route, POST /api/auth/login
// @access, Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hitta användaren via e-post.
    const user = await User.findOne({ email });

    // Verifiera lösenord med matchPassword-metoden från User.js.
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        apartmentNumber: user.apartmentNumber,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Felaktig e-post eller lösenord' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc, Begär återställning av lösenord (Glömt lösenord)
// @route, POST /api/auth/forgot-password
// @access, Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Ingen användare hittades med den e-postadressen' });
    }

    // Generera återställningstoken via User.js-metoden.
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // I produktion skickas ett mejl här. För utveckling returnerar vi token/länk direkt.
    res.status(200).json({
      success: true,
      message: 'Återställningstoken skapad',
      resetToken: resetToken, // Används i frontend för att bygga återställningssidan.
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc, Sätt nytt lösenord med token
// @route, PUT /api/auth/reset-password/:resetToken
// @access, Public
exports.resetPassword = async (req, res) => {
  try {
    // Hasha token som skickas i URL:en för att jämföra med databasen.
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Kontrollera att token inte gått ut.
    });

    if (!user) {
      return res.status(400).json({ message: 'Ogiltig eller utgången återställningskod' });
    }

    // Uppdatera lösenordet och rensa reset-fälten.
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Lösenordet har uppdaterats! Du kan nu logga in.',
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};