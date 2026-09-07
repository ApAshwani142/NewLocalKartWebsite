import express from 'express';
import {
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
} from '../controllers/productController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

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

export default router;
