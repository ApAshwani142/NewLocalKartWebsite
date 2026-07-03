const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

// Route is protected, only logged-in users can chat
router.post('/', protect, handleChat);

module.exports = router;
