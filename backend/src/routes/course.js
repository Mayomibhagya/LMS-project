// backend/src/routes/course.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const courseController = require('../controllers/courseController');

router.post('/', authMiddleware, courseController.createCourse);
router.get('/', courseController.getCourses);
router.get('/my', authMiddleware, courseController.getMyCourses);
router.put('/:id', authMiddleware, courseController.updateCourse);
router.delete('/:id', authMiddleware, courseController.deleteCourse);
router.put('/:id/approve', authMiddleware, courseController.approveCourse);
router.put('/:id/reject', authMiddleware, courseController.rejectCourse);
router.get('/pending', authMiddleware, courseController.getPendingCourses);
const upload = require('../middlewares/uploadMiddleware');

router.post('/:id/upload', authMiddleware, upload.single('file'), courseController.uploadMaterial);
router.get('/:id/materials', authMiddleware, courseController.getCourseMaterials);

module.exports = router;
