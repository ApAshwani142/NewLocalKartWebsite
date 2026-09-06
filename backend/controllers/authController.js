const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');
const { sendOtpEmail } = require('../services/emailService');

// Generate JWT token
const generateToken = (user) => {
  const userId = user._id ? user._id.toString() : user.id ? user.id.toString() : user.toString();
  const email = typeof user === 'object' && user.email ? user.email : '';
  const role = typeof user === 'object' && user.role ? user.role : '';
  const name = typeof user === 'object' && user.name ? user.name : '';

  return jwt.sign(
    { userId, id: userId, email, role, name },
    process.env.JWT_SECRET || 'localkart_super_secret_jwt_key_change_in_production',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, otp } = req.body;

    if (!name || !email || !phone || !password || !otp) {
      return res.status(400).json({ message: 'Please enter all fields including OTP' });
    }

    // Check if user exists by email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check if user exists by phone
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }

    // Verify OTP strictly against database
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired verification OTP. Please try requesting a new code.' });
    }

    // Delete the verified OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    // Create user with specified or default role
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: req.body.role || 'customer'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        fcmToken: user.fcmToken,
        token: generateToken(user)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: 'Please enter email/phone and password' });
    }

    // Find user by email OR phone
    const user = await User.findOne({
      $or: [
        { email: emailOrPhone },
        { phone: emailOrPhone }
      ]
    }).select('+password'); // select password to verify

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Check if email already exists for another user
      if (req.body.email && req.body.email !== user.email) {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
          return res.status(400).json({ message: 'User with this email already exists' });
        }
      }

      // Check if phone already exists for another user
      if (req.body.phone && req.body.phone !== user.phone) {
        const phoneExists = await User.findOne({ phone: req.body.phone });
        if (phoneExists) {
          return res.status(400).json({ message: 'User with this phone number already exists' });
        }
      }

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        token: generateToken(updatedUser)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Send OTP to email for verification
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check if user exists by email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check if user exists by phone
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }

    // Generate 6-digit random code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Clear any existing OTPs for this email
    await Otp.deleteMany({ email });

    // Save OTP to database
    await Otp.create({
      email,
      otp: otpCode
    });

    // Deliver real OTP email using configured transport
    const deliveryResult = await sendOtpEmail({ email, name, otpCode });

    return res.status(200).json({
      success: true,
      provider: deliveryResult.provider,
      previewUrl: deliveryResult.previewUrl,
      message: deliveryResult.message || 'Verification OTP sent successfully to your email address.'
    });
  } catch (error) {
    console.error('Send OTP Error:', error.message);
    res.status(500).json({ message: 'Error sending verification code: ' + error.message });
  }
};

// @desc    Update FCM token for push notifications (FCM readiness)
// @route   PUT /api/auth/fcm-token
// @access  Private
const updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    if (!fcmToken) {
      return res.status(400).json({ message: 'Please provide an fcmToken' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fcmToken },
      { new: true }
    );

    res.json({
      message: 'FCM token registered/updated successfully',
      fcmToken: user.fcmToken
    });
  } catch (error) {
    console.error('Update FCM Token Error:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Authenticate/Register user using Firebase ID Token (Phone OTP)
// @route   POST /api/auth/firebase-login
// @access  Public
const firebaseLogin = async (req, res) => {
  try {
    const { idToken, name, role, email } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Firebase ID Token is required' });
    }

    const { verifyFirebaseIdToken } = require('../services/firebaseService');
    const { findOrCreateFirebaseUser } = require('../services/userService');

    // 1. Verify Firebase ID Token via Firebase Admin SDK
    const decodedFirebase = await verifyFirebaseIdToken(idToken);

    // 2. Find or Create User in MongoDB (MongoDB role is strictly enforced)
    const result = await findOrCreateFirebaseUser({
      firebaseUid: decodedFirebase.uid,
      phone: decodedFirebase.phone,
      email: email || decodedFirebase.email,
      name: name || decodedFirebase.name,
      requestedRole: role
    });

    res.status(200).json({
      success: true,
      message: 'Firebase OTP verification successful',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    console.error('Firebase Login Controller Error:', error.message);
    res.status(401).json({ message: 'Authentication failed: ' + error.message });
  }
};

// @desc    Authenticate/Register user using Supabase Access Token / Session
// @route   POST /api/auth/supabase-login
// @access  Public
const supabaseLogin = async (req, res) => {
  try {
    const { accessToken, supabaseUid, email, name, phone, role } = req.body;

    let sbUser = null;

    if (accessToken) {
      const { verifySupabaseToken } = require('../services/supabaseService');
      try {
        sbUser = await verifySupabaseToken(accessToken);
      } catch (err) {
        console.warn('Supabase token verification failed, falling back to direct body verification:', err.message);
      }
    }

    const uid = sbUser?.id || supabaseUid;
    const userEmail = sbUser?.email || email;
    const userName = sbUser?.user_metadata?.full_name || sbUser?.user_metadata?.name || name;
    const userPhone = sbUser?.user_metadata?.phone || phone;
    const userRole = sbUser?.user_metadata?.role || role || 'customer';

    if (!uid && !userEmail) {
      return res.status(400).json({ message: 'Supabase access token, UID, or email is required' });
    }

    const { findOrCreateSupabaseUser } = require('../services/userService');

    const result = await findOrCreateSupabaseUser({
      supabaseUid: uid,
      email: userEmail,
      phone: userPhone,
      name: userName,
      requestedRole: userRole
    });

    res.status(200).json({
      success: true,
      message: 'Supabase authentication successful',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    console.error('Supabase Login Controller Error:', error.message);
    res.status(401).json({ message: 'Supabase login failed: ' + error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  sendOtp,
  updateFcmToken,
  firebaseLogin,
  supabaseLogin
};
