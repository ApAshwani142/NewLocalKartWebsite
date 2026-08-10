const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  verifyPayment,
  getOrderById,
  getMyOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/', authenticateUser, addOrderItems);
router.post('/verify', authenticateUser, verifyPayment);
router.get('/myorders', authenticateUser, getMyOrders);
router.put('/:id/status', authenticateUser, updateOrderStatus);
router.get('/:id', authenticateUser, getOrderById);

module.exports = router;
