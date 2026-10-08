import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Autentisering krävs' });
  }

  try {
    const payload = jwt.verify(
      authorization.slice('Bearer '.length),
      process.env.JWT_SECRET || 'fallback_secret'
    );

    if (typeof payload === 'string' || typeof payload.id !== 'string') {
      return res.status(401).json({ message: 'Ogiltig autentiseringstoken' });
    }

    req.user = { id: payload.id };
    return next();
  } catch {
    return res.status(401).json({ message: 'Ogiltig eller utgången autentiseringstoken' });
  }
}