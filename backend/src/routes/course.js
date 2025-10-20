// backend/src/routes/course.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const courseController = require('../controllers/courseController');

router.post('/', authMiddleware, courseController.createCourse);
router.get('/', courseController.getCourses);
router.put('/:id', authMiddleware, courseController.updateCourse);
router.delete('/:id', authMiddleware, courseController.deleteCourse);

module.exports = router;
