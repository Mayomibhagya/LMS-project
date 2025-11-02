// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');

// Signup with validation
router.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'lecturer', 'student']).withMessage('Invalid role')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return authController.signup(req, res, next);
  }
);

// Login with validation
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return authController.login(req, res, next);
  }
);

router.get('/me', auth, async (req, res) => {
  // Return current user
  const User = require('../models/User');
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/me', auth, async (req, res) => {
  const User = require('../models/User');
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.password) {
      const bcrypt = require('bcryptjs');
      updates.password = await bcrypt.hash(req.body.password, 10);
    }
    if (Object.keys(updates).length === 0)
      return res.status(400).json({ message: 'No valid fields to update' });
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
