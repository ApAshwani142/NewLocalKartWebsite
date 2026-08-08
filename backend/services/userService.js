const User = require('../models/User');
const { generateToken } = require('./jwtService');

/**
 * Find or create user after successful Firebase ID Token verification
 * Roles: 'customer', 'shopkeeper', 'delivery_agent', 'admin'
 */
async function findOrCreateFirebaseUser({ firebaseUid, phone, email, name, requestedRole }) {
  if (!phone && !email && !firebaseUid) {
    throw new Error('User identifier (phone, email, or firebaseUid) is required');
  }

  // Search by firebaseUid OR phone OR email
  let user = await User.findOne({
    $or: [
      { firebaseUid },
      { phone: phone || 'DO_NOT_MATCH' },
      { email: email && email !== '' ? email : 'DO_NOT_MATCH' }
    ]
  });

  const ALLOWED_ROLES = ['customer', 'shopkeeper', 'delivery_agent', 'admin'];

  if (!user) {
    // Determine initial role (default to 'customer' if invalid or empty)
    const role = (requestedRole && ALLOWED_ROLES.includes(requestedRole)) ? requestedRole : 'customer';

    const cleanUid = firebaseUid.toLowerCase().replace(/[^a-z0-9]/g, '');
    user = await User.create({
      firebaseUid,
      phone: phone || `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      email: email || `${cleanUid}@elocalkart.com`,
      name: name || (role === 'shopkeeper' ? 'Merchant Partner' : role === 'delivery_agent' ? 'Delivery Agent' : 'Local Customer'),
      password: `fb_auth_${Date.now()}`,
      role,
      isVerified: true
    });

    console.log(`[UserService] Created new user with ID: ${user._id}, Role: ${user.role}`);
  } else {
    // Existing user: Link firebaseUid & mark verified if not set
    if (!user.firebaseUid || user.firebaseUid !== firebaseUid) {
      user.firebaseUid = firebaseUid;
    }
    user.isVerified = true;
    if (name && (!user.name || user.name.startsWith('Firebase Verified'))) {
      user.name = name;
    }
    await user.save();
    console.log(`[UserService] Loaded existing user ID: ${user._id}, Strictly Enforced MongoDB Role: ${user.role}`);
  }

  // Generate Application JWT Token containing User ID and MongoDB Role
  const jwtToken = generateToken({ id: user._id, role: user.role });

  return {
    user: {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      firebaseUid: user.firebaseUid,
      fcmToken: user.fcmToken,
      isVerified: user.isVerified,
      store: user.store
    },
    token: jwtToken
  };
}

/**
 * Find or create user after successful Supabase Auth token verification
 * Roles: 'customer', 'shopkeeper', 'delivery_agent', 'admin'
 */
async function findOrCreateSupabaseUser({ supabaseUid, email, phone, name, requestedRole }) {
  if (!email && !supabaseUid && !phone) {
    throw new Error('User identifier (email, phone, or supabaseUid) is required');
  }

  // Search by supabaseUid OR email OR phone
  let user = await User.findOne({
    $or: [
      { supabaseUid: supabaseUid || 'DO_NOT_MATCH' },
      { email: email && email !== '' ? email : 'DO_NOT_MATCH' },
      { phone: phone && phone !== '' ? phone : 'DO_NOT_MATCH' }
    ]
  });

  const ALLOWED_ROLES = ['customer', 'shopkeeper', 'delivery_agent', 'admin'];

  if (!user) {
    // Determine initial role (default to 'customer' if invalid or empty)
    const role = (requestedRole && ALLOWED_ROLES.includes(requestedRole)) ? requestedRole : 'customer';

    const cleanUid = (supabaseUid || 'sb_' + Date.now()).toLowerCase().replace(/[^a-z0-9]/g, '');
    user = await User.create({
      supabaseUid,
      email: email || `${cleanUid}@elocalkart.com`,
      phone: phone || `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      name: name || (role === 'shopkeeper' ? 'Merchant Partner' : role === 'delivery_agent' ? 'Delivery Agent' : 'Local Customer'),
      password: `sb_auth_${Date.now()}`,
      role
    });

    console.log(`[UserService] Created new Supabase user with ID: ${user._id}, Role: ${user.role}`);
  } else {
    // Existing user: Link supabaseUid if missing
    if (supabaseUid && (!user.supabaseUid || user.supabaseUid !== supabaseUid)) {
      user.supabaseUid = supabaseUid;
    }
    if (name && (!user.name || user.name.startsWith('Supabase Verified'))) {
      user.name = name;
    }
    await user.save();
    console.log(`[UserService] Loaded existing user ID: ${user._id}, Role: ${user.role}`);
  }

  // Generate Application JWT Token containing User ID and MongoDB Role
  const jwtToken = generateToken({ id: user._id, role: user.role });

  return {
    user: {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      supabaseUid: user.supabaseUid,
      fcmToken: user.fcmToken,
      store: user.store
    },
    token: jwtToken
  };
}

/**
 * Update FCM Token for Push Notifications
 */
async function updateUserFcmToken(userId, fcmToken) {
  if (!userId || !fcmToken) {
    throw new Error('userId and fcmToken are required');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { fcmToken },
    { new: true }
  ).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

module.exports = {
  findOrCreateFirebaseUser,
  findOrCreateSupabaseUser,
  updateUserFcmToken
};
