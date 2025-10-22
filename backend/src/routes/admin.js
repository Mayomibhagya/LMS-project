// backend/src/routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const authMiddleware = require('../middlewares/authMiddleware');

// Admin Dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const totalPayments = await Payment.countDocuments();

    res.json({
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalPayments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
