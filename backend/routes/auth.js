import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  sendOtp,
  updateFcmToken,
  firebaseLogin,
  supabaseLogin
} from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/firebase-login', firebaseLogin);
router.post('/supabase-login', supabaseLogin);
router.post('/send-otp', sendOtp);
router.get('/me', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateUserProfile);
router.put('/fcm-token', authenticateUser, updateFcmToken);

export default router;
