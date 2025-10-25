// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // id, role 

    next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
