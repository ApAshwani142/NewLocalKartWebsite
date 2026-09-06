const express = require('express');
const router = express.Router();
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/addressController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.use(authenticateUser);

router.get('/', getAddresses);
router.post('/', addAddress);
router.put('/:addressId', updateAddress);
router.delete('/:addressId', deleteAddress);

module.exports = router;
