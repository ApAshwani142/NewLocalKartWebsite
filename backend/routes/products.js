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
  deleteProduct,
  getMerchantProducts
} = require('../controllers/productController');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', getProducts);
router.post('/seed', seedProducts);
router.get('/search/all', searchHyperlocal);

// Merchant endpoints
router.get('/merchant/my-products', authenticateUser, authorizeRole('shopkeeper', 'admin'), getMerchantProducts);

// Single product endpoints
router.get('/:id', getProductById);
router.post('/', authenticateUser, authorizeRole('shopkeeper', 'admin'), createProduct);
router.put('/:id', authenticateUser, authorizeRole('shopkeeper', 'admin'), updateProduct);
router.delete('/:id', authenticateUser, authorizeRole('shopkeeper', 'admin'), deleteProduct);

// Reviews & Recommendations
router.post('/:id/reviews', authenticateUser, createProductReview);
router.delete('/:id/reviews/:reviewId', authenticateUser, deleteProductReview);
router.get('/:id/recommendations', getProductRecommendations);

module.exports = router;
