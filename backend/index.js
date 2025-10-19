// backend/src/index.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
app.use(express.json());

// connect with MongoDB
connectDB();


app.use('/api/auth', authRoutes);

// Error handler middleware (should be last)
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('LMS Backend Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
