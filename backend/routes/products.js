const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  searchHyperlocal,
  seedProducts,
  createProductReview,
  deleteProductReview,
  getProductRecommendations,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', getProducts);
router.post('/seed', seedProducts);
router.get('/search/all', searchHyperlocal);

// Single product endpoints
router.get('/:id', getProductById);
router.post('/', authenticateUser, createProduct);
router.put('/:id', authenticateUser, updateProduct);
router.delete('/:id', authenticateUser, deleteProduct);

// Reviews & Recommendations
router.post('/:id/reviews', authenticateUser, createProductReview);
router.delete('/:id/reviews/:reviewId', authenticateUser, deleteProductReview);
router.get('/:id/recommendations', getProductRecommendations);

module.exports = router;
