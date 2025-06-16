import jwt from 'jsonwebtoken';

// Middleware to protect routes
export const protectRoute = (req, res, next) => {
  // Read the token from the cookie named 'jwt'
  const token = req.cookies?.jwt;

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token in cookie' });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
