import { verifyToken } from '../utils/jwt.js';

// Protect routes — requires a valid Bearer JWT. Attaches req.user.
export function protect(req, res, next) {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token provided.' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = { _id: decoded.id };
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized — invalid or expired token.' });
  }
}
