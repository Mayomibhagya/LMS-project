// backend/src/routes/enrollment.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const enrollmentController = require('../controllers/enrollmentController');

// student enroll
router.post('/', auth, enrollmentController.enrollCourse);

// student view
router.get('/my', auth, enrollmentController.getMyEnrollments);

// lecturer/admin view 
router.get('/all', auth, enrollmentController.getAllEnrollments);

module.exports = router;
