import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items/:productId', updateCartItemQuantity);
router.delete('/items/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;
