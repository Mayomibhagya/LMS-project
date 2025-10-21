// backend/src/models/Enrollment.js
const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['enrolled', 'completed'], default: 'enrolled' }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
