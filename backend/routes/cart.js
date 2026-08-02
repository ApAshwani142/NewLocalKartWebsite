const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.use(authenticateUser);

router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items/:productId', updateCartItemQuantity);
router.delete('/items/:productId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
