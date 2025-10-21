// backend/src/index.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const errorHandler = require('./src/middlewares/errorHandler');
const courseRoutes = require('./src/routes/course');
const enrollmentRoutes = require('./src/routes/enrollment');
const paymentRoutes = require('./src/routes/payment');

const app = express();
app.use(express.json());

// connect with MongoDB
connectDB();


app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/payment', paymentRoutes);

// Error handler middleware (should be last)
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('LMS Backend Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
