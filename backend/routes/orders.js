const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  verifyPayment,
  getOrderById,
  getMyOrders
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addOrderItems);
router.post('/verify', protect, verifyPayment);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;
