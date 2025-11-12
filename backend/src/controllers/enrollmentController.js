// backend/src/controllers/enrollmentController.js
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Enroll student only
exports.enrollCourse = async (req, res) => {
  try {
    if (req.user.role !== 'student')
      return res.status(403).json({ message: 'Only students can enroll' });

    const { courseId } = req.body;

    // check course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // check already enrolled
    const existing = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (existing) return res.status(400).json({ message: 'Already enrolled' });

    const enrollment = new Enrollment({ student: req.user.id, course: courseId });
    await enrollment.save();

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// View enrolled courses by student
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course', 'title category lecturer');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// View all enrollments by lecturer or admin
exports.getAllEnrollments = async (req, res) => {
  try {
    if (req.user.role !== 'lecturer' && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied' });

    const enrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Mark a course as completed by student
exports.markCompleted = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    if (enrollment.student.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    enrollment.status = 'completed';
    await enrollment.save();
    res.json({ message: 'Marked as completed', enrollment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id });
    const completed = enrollments.filter(e => e.status === 'completed').length;
    const total = enrollments.length;
    res.json({ completed, total, percent: total > 0 ? Math.round((completed / total)*100) : 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};