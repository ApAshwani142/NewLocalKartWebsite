import express from 'express';
import {
  addOrderItems,
  verifyPayment,
  getOrderById,
  getMyOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, addOrderItems);
router.post('/verify', authenticateUser, verifyPayment);
router.get('/myorders', authenticateUser, getMyOrders);
router.put('/:id/status', authenticateUser, updateOrderStatus);
router.get('/:id', authenticateUser, getOrderById);

export default router;
