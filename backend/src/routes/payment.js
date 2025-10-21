const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const paymentController = require('../controllers/paymentController');

router.post('/', auth, paymentController.makePayment);

module.exports = router;
