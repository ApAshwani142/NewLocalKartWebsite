import express from 'express';
import {
  getNotifications,
  markAsRead
} from '../controllers/notificationController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);

export default router;
