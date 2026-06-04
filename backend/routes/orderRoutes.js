const express = require('express');
const {
  clearOrders,
  createOrder,
  deleteOrder,
  getOrders,
  updatePaymentStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.delete('/', clearOrders);
router.patch('/:id/payment', updatePaymentStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
