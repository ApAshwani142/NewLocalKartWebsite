const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  sendOtp,
  updateFcmToken
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOtp);
router.get('/me', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateUserProfile);
router.put('/fcm-token', authenticateUser, updateFcmToken);

module.exports = router;
