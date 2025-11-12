// backend/src/controllers/paymentController.js
const Enrollment = require('../models/Enrollment');

// Mock payment
exports.makePayment = async (req, res) => {
  try {
    if (req.user.role !== 'student')
      return res.status(403).json({ message: 'Only students can make payments' });

    const { enrollmentId, method } = req.body;
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    // fake transaction
    const fakeTransactionId = 'TXN' + Date.now();

    enrollment.paymentStatus = 'paid';
    enrollment.transactionId = fakeTransactionId;
    await enrollment.save();

    res.json({
      message: 'Payment successful',
      transactionId: fakeTransactionId,
      method
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
