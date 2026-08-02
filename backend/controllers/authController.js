const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretlocalkartkey12345!', {
    expiresIn: '30d'
  });
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

    // Verify OTP (allow 123456 bypass for automated testing)
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord && otp !== '123456') {
      return res.status(400).json({ message: 'Invalid or expired verification OTP. Please try again.' });
    }

    // Delete the verified OTP
    if (otpRecord) {
      await Otp.deleteOne({ _id: otpRecord._id });
    }

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
        token: generateToken(user._id)
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
        token: generateToken(user._id)
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
        token: generateToken(updatedUser._id)
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

    // Save OTP
    await Otp.create({
      email,
      otp: otpCode
    });

    const resendApiKey = process.env.RESEND_API_KEY || process.env.RESEND_KEY_API;

    const emailTemplateHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Email Verification Code</title>
        <style>
          body { font-family: 'Outfit', -apple-system, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; }
          .card { background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; padding: 32px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 24px; text-align: center; }
          .logo { font-size: 24px; font-weight: 900; color: #0e3e26; text-decoration: none; }
          .logo span { color: #f97316; }
          .title { font-size: 20px; font-weight: 800; color: #111827; margin-top: 0; text-align: center; }
          .otp-container { text-align: center; margin: 30px 0; }
          .otp-code { display: inline-block; font-size: 32px; font-weight: 950; color: #0e3e26; letter-spacing: 6px; background-color: #f0fdf4; border: 2px dashed #10b981; border-radius: 12px; padding: 12px 24px; }
          .instructions { font-size: 14px; color: #4b5563; line-height: 1.6; text-align: center; }
          .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="logo">e-<span>Local</span>Kart</div>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #4b5563; font-weight: bold;">Verify Your Email Address</p>
          </div>
          
          <h2 class="title">Your Verification Code</h2>
          <p class="instructions">Hi ${name}, thank you for registering with e-LocalKart! Please use the following One-Time Password (OTP) to complete your signup process. This code is valid for 5 minutes:</p>
          
          <div class="otp-container">
            <span class="otp-code">${otpCode}</span>
          </div>
          
          <p class="instructions" style="font-size: 12px; color: #9ca3af;">If you did not request this verification code, please ignore this email.</p>
          
          <div class="footer">
            This verification email was sent automatically from the e-LocalKart server.<br>
            &copy; 2026 e-LocalKart, Bihar, India
          </div>
        </div>
      </body>
      </html>
    `;

    if (resendApiKey) {
      console.log(`Sending signup verification OTP to ${email} via Resend...`);
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: `e-LocalKart Verification <${fromEmail}>`,
          to: [email],
          subject: `${otpCode} is your e-LocalKart Verification Code`,
          html: emailTemplateHtml
        })
      });

      const resData = await response.json();

      if (!response.ok) {
        console.error('Resend API returned error:', resData);
        if (resData.name === 'validation_error' || response.status === 403) {
          console.warn('------------------------------------------------------------');
          console.warn(`SANDBOX LIMITATION DETECTED: Could not send email to ${email}.`);
          console.warn(`YOUR SIGNUP VERIFICATION OTP IS: ${otpCode}`);
          console.warn('------------------------------------------------------------');
          return res.status(200).json({
            success: true,
            simulated: true,
            message: `OTP sent successfully! (Simulated: Check server terminal for OTP code because email ${email} is not verified in Resend sandbox)`
          });
        }
        throw new Error(resData.message || 'Failed to send verification email');
      }

      console.log('Resend OTP Email sent successfully. ID:', resData.id);
      return res.status(200).json({
        success: true,
        message: 'Verification OTP sent to your email!'
      });
    } else {
      console.log('------------------------------------------------------------');
      console.log('RESEND_API_KEY NOT SET IN .ENV. RUNNING IN SIMULATION MODE.');
      console.log(`Recipient: ${email}`);
      console.log(`YOUR SIGNUP VERIFICATION OTP IS: ${otpCode}`);
      console.log('------------------------------------------------------------');
      return res.status(200).json({
        success: true,
        simulated: true,
        message: 'OTP sent successfully! (Simulated: Check server terminal for OTP code)'
      });
    }
  } catch (error) {
    console.error('Send OTP Error:', error.message);
    res.status(500).json({ message: 'Server error sending verification code: ' + error.message });
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

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  sendOtp,
  updateFcmToken
};
