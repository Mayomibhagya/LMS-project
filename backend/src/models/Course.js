// backend/src/models/Course.js
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  price: { type: Number, default: 0 },
  duration: { type: String, required: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
  lecturer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  materials: [{ type: String }], //files upload
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);
