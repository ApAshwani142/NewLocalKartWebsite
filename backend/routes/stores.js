const express = require('express');
const router = express.Router();
const { getStores, getStoreById } = require('../controllers/storeController');

router.get('/', getStores);
router.get('/:id', getStoreById);

module.exports = router;
