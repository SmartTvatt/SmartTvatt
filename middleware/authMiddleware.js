import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware för att skydda rutter som kräver inloggning
export const protect = async (req, res, next) => {
  let token;

  // Kontrollera om "Authorization: Bearer <token>" finns i request headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Hämta själva token-strängen
      token = req.headers.authorization.split(' ')[1];

      // Verifiera token med din JWT_SECRET
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret'
      );

      // Hämta användaren från databasen utan lösenordet och fäst på req.user
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res
          .status(401)
          .json({ message: 'Inte behörig, användaren finns inte längre' });
      }

      next(); // Fortsätt till routen/controllern
    } catch (error) {
      console.error('JWT Verifieringsfel:', error.message);
      return res.status(401).json({ message: 'Inte behörig, ogiltig token' });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Inte behörig, token saknas i anropet' });
  }
};

// Middleware för att begränsa rutter till specifika roller (t.ex. 'admin')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Rollen '${req.user.role}' har inte behörighet att utföra denna åtgärd`,
      });
    }
    next();
  };
};