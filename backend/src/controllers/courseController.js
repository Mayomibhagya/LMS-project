// backend/src/controllers/courseController.js
const Course = require('../models/Course');

// Create course 
exports.createCourse = async (req, res) => {
  try {
    if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const course = await Course.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      createdBy: req.user.id,     
      lecturer: req.user.id       
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('lecturer', 'name email');
    res.json(courses);
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//Get courses by lec
exports.getMyCourses = async (req, res) => {
  try {
    if (req.user.role !== 'lecturer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const courses = await Course.find({ createdBy: req.user.id });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching lecturer courses:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (
      req.user.role !== 'admin' &&
      req.user.id !== (course.createdBy?.toString() || course.lecturer?.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (
      req.user.role !== 'admin' &&
      req.user.id !== (course.createdBy?.toString() || course.lecturer?.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//Upload course material
exports.uploadMaterial = async (req, res) => {
  try {
    if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const filePath = req.file.path;
    course.materials.push(filePath);
    await course.save();

    res.status(200).json({ message: 'File uploaded successfully', filePath });
  } catch (error) {
    console.error('Error uploading material:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
