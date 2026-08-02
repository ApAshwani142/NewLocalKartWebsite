const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  verifyPayment,
  getOrderById,
  getMyOrders,
  getStoreOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', authenticateUser, addOrderItems);
router.post('/verify', authenticateUser, verifyPayment);
router.get('/myorders', authenticateUser, getMyOrders);
router.get('/store-orders', authenticateUser, authorizeRole('shopkeeper', 'admin', 'delivery_agent'), getStoreOrders);
router.put('/:id/status', authenticateUser, authorizeRole('shopkeeper', 'admin', 'delivery_agent'), updateOrderStatus);
router.get('/:id', authenticateUser, getOrderById);

module.exports = router;
