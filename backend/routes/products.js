const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  seedProducts,
  createProductReview,
  deleteProductReview,
  getProductRecommendations
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.post('/seed', seedProducts);
router.get('/:id', getProductById);

// Reviews & Recommendations
router.post('/:id/reviews', protect, createProductReview);
router.delete('/:id/reviews/:reviewId', protect, deleteProductReview);
router.get('/:id/recommendations', getProductRecommendations);

module.exports = router;
