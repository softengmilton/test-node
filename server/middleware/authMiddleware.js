// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    // 1. Get token from Authorization header: “Bearer <token>”
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Find user
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    if (!user.isVerified)
      return res.status(403).json({ error: 'Email not verified' });

    // 3. Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('AuthMiddleware error:', err);
    return res.status(401).json({ error: 'Token verification failed' });
  }
};
