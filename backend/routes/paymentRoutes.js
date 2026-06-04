const express = require('express');
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require('../controllers/paymentController');

const router = express.Router();

router.post('/razorpay/order', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);

module.exports = router;
