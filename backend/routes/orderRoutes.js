const express = require('express');
const {
  clearOrders,
  createOrder,
  deleteOrder,
  getOrders,
} = require('../controllers/orderController');

const router = express.Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.delete('/', clearOrders);
router.delete('/:id', deleteOrder);

module.exports = router;
