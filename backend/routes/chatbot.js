import express from 'express';
import { handleChat } from '../controllers/chatbotController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route is protected, only logged-in users can chat
router.post('/', protect, handleChat);

export default router;
