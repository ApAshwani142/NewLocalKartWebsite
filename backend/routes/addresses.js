import express from 'express';
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from '../controllers/addressController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/', getAddresses);
router.post('/', addAddress);
router.put('/:addressId', updateAddress);
router.delete('/:addressId', deleteAddress);

export default router;
