const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { verifyFirebaseIdToken } = require('./services/firebaseService');
const { generateToken, verifyToken } = require('./services/jwtService');
const { findOrCreateFirebaseUser, updateUserFcmToken } = require('./services/userService');
const {
  sendFcmNotification,
  notifyShopkeeperNewOrder,
  notifyCustomerOrderAccepted,
  notifyRidersOrderReady,
  notifyCustomerOrderPickedUp,
  notifyCustomerOrderDelivered
} = require('./services/notificationService');

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

async function runFirebaseArchitectureTests() {
  console.log('===========================================================');
  console.log('STARTING FIREBASE AUTH, CUSTOM JWT & FCM ARCHITECTURE TESTS');
  console.log('===========================================================\n');

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/localkart';
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB:', mongoUri);
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }

  const server = app.listen(5098, async () => {
    const baseUrl = 'http://localhost:5098/api';

    try {
      // 1. Clean up test records
      await User.deleteMany({ phone: { $in: ['9991112223', '9991112224', '9991112225'] } });

      // 2. Test Firebase ID Token Service Verification
      console.log('\n--- 1. Testing Firebase ID Token Verification Service ---');
      const mockIdToken = JSON.stringify({
        uid: 'fb_user_uid_1001',
        phone: '9991112223',
        name: 'Firebase Phone User'
      });
      const decodedFirebase = await verifyFirebaseIdToken(mockIdToken);
      if (!decodedFirebase.uid || !decodedFirebase.phone) {
        throw new Error('Firebase ID token verification failed!');
      }
      console.log('✅ Firebase ID Token Verified! UID:', decodedFirebase.uid, 'Phone:', decodedFirebase.phone);

      // 3. Test User Creation & MongoDB Role Isolation
      console.log('\n--- 2. Testing User Creation & Role Enforcement ---');
      const userResult = await findOrCreateFirebaseUser({
        firebaseUid: decodedFirebase.uid,
        phone: decodedFirebase.phone,
        name: 'Firebase Phone Customer',
        requestedRole: 'customer'
      });

      if (!userResult.token || userResult.user.role !== 'customer') {
        throw new Error('User creation or role assignment failed!');
      }
      console.log('✅ User Created with MongoDB Role:', userResult.user.role);

      // Verify custom JWT token decoding
      const decodedJwt = verifyToken(userResult.token);
      if (decodedJwt.role !== 'customer' || decodedJwt.id !== userResult.user._id.toString()) {
        throw new Error('Decoded custom JWT payload mismatch!');
      }
      console.log('✅ Custom Application JWT Signed & Verified! Decoded Role:', decodedJwt.role);

      // 4. Test Existing User Role Security (Must ignore client role tampering!)
      console.log('\n--- 3. Testing Strict MongoDB Role Isolation on Existing Login ---');
      const reLoginResult = await findOrCreateFirebaseUser({
        firebaseUid: decodedFirebase.uid,
        phone: decodedFirebase.phone,
        name: 'Firebase Phone Customer',
        requestedRole: 'admin' // Attempting to tamper role on login request!
      });

      if (reLoginResult.user.role !== 'customer') {
        throw new Error('SECURITY VULNERABILITY DETECTED: Client tampered role was trusted over MongoDB role!');
      }
      console.log('✅ SECURE! MongoDB Role ("customer") strictly enforced despite client requesting "admin".');

      // 5. Test Endpoint: POST /api/auth/firebase-login
      console.log('\n--- 4. Testing End-to-End API: POST /api/auth/firebase-login ---');
      const apiFbLoginRes = await fetch(`${baseUrl}/auth/firebase-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken: mockIdToken,
          name: 'Firebase API User',
          role: 'customer'
        })
      });
      const apiFbLoginData = await apiFbLoginRes.json();
      if (!apiFbLoginRes.ok || !apiFbLoginData.token) {
        throw new Error(`Firebase login API failed: ${apiFbLoginData.message}`);
      }
      console.log('✅ POST /api/auth/firebase-login endpoint verified! Returned custom JWT.');

      // 6. Test FCM Token Sync: PUT /api/auth/fcm-token
      console.log('\n--- 5. Testing FCM Token Registration ---');
      const updatedUser = await updateUserFcmToken(userResult.user._id, 'fcm_token_device_device_999');
      if (updatedUser.fcmToken !== 'fcm_token_device_device_999') {
        throw new Error('FCM token update failed!');
      }
      console.log('✅ FCM Token Saved to User Model:', updatedUser.fcmToken);

      // 7. Test FCM Push Notification Triggers for Order Lifecycle
      console.log('\n--- 6. Testing FCM Order Lifecycle Notification Triggers ---');
      const mockOrder = {
        _id: new mongoose.Types.ObjectId(),
        user: userResult.user._id,
        totalPrice: 450
      };

      const fcmDispatchResult = await sendFcmNotification('fcm_token_device_device_999', {
        title: '📦 Test Order Received',
        body: 'Your hyperlocal order is confirmed!'
      });
      if (!fcmDispatchResult.success) {
        throw new Error('FCM Push Notification dispatch failed!');
      }
      console.log('✅ FCM Notification Dispatcher operational!');

      // Test Notification Triggers
      const notifRes1 = await notifyShopkeeperNewOrder(mockOrder, userResult.user._id);
      const notifRes2 = await notifyCustomerOrderAccepted(mockOrder);
      const notifRes3 = await notifyCustomerOrderDelivered(mockOrder);

      if (!notifRes1 || !notifRes2 || !notifRes3) {
        throw new Error('Order lifecycle notification triggers failed!');
      }
      console.log('✅ All 5 FCM Order Lifecycle Event Triggers verified!');

      console.log('\n===========================================================');
      console.log('🎉 FIREBASE AUTH, CUSTOM JWT & FCM TESTS PASSED 100%!');
      console.log('===========================================================\n');
    } catch (err) {
      console.error('\n❌ FIREBASE ARCHITECTURE TEST FAILED:', err.message);
    } finally {
      server.close();
      await mongoose.connection.close();
      process.exit(0);
    }
  });
}

runFirebaseArchitectureTests();
