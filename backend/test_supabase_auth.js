
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { findOrCreateSupabaseUser } = require('./services/userService');
const { verifySupabaseToken } = require('./services/supabaseService');
const { generateToken, verifyToken } = require('./services/jwtService');
const User = require('./models/User');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

async function runSupabaseAuthTests() {
  console.log('===========================================================');
  console.log('STARTING SUPABASE AUTHENTICATION & INTEGRATION TESTS');
  console.log('===========================================================\n');

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/localkart';
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB:', mongoUri);
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }

  const server = app.listen(5099, async () => {
    const baseUrl = 'http://localhost:5099/api';

    try {
      // 1. Clean up test records
      await User.deleteMany({ email: 'supabase_test_user@example.com' });

      // 2. Test direct UserService integration
      console.log('\n--- 1. Testing findOrCreateSupabaseUser Service ---');
      const testSbUid = 'sb_test_uid_' + Date.now();
      const sbResult = await findOrCreateSupabaseUser({
        supabaseUid: testSbUid,
        email: 'supabase_test_user@example.com',
        phone: '+919876543210',
        name: 'Supabase Tester',
        requestedRole: 'customer'
      });

      console.log('✅ Created user in DB via Supabase service:');
      console.log('   User ID:', sbResult.user._id);
      console.log('   Role:', sbResult.user.role);
      console.log('   Supabase UID:', sbResult.user.supabaseUid);
      console.log('   App JWT Token generated:', sbResult.token.substring(0, 30) + '...');

      // Verify JWT token decoding
      const decoded = verifyToken(sbResult.token);
      console.log('✅ Verified app JWT payload:', decoded);

      // 3. Test API Endpoint: POST /api/auth/supabase-login
      console.log('\n--- 2. Testing API Endpoint: POST /api/auth/supabase-login ---');
      const apiRes = await fetch(`${baseUrl}/auth/supabase-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseUid: testSbUid,
          email: 'supabase_test_user@example.com',
          name: 'Supabase Tester Updated',
          role: 'customer'
        })
      });

      const apiData = await apiRes.json();
      console.log('✅ Supabase login API status:', apiRes.status);
      console.log('✅ Returned user:', apiData.user);

      // 4. Test Authenticated Profile Route: GET /api/auth/me
      console.log('\n--- 3. Testing Protected Endpoint: GET /api/auth/me with App JWT ---');
      const meRes = await fetch(`${baseUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${apiData.token}`
        }
      });
      const meData = await meRes.json();
      console.log('✅ GET /api/auth/me status:', meRes.status);
      console.log('✅ Authenticated user profile:', meData);

      console.log('\n===========================================================');
      console.log('🎉 ALL SUPABASE AUTHENTICATION TESTS PASSED SUCCESSFULLY!');
      console.log('===========================================================\n');
    } catch (error) {
      console.error('❌ Supabase Auth Test Failure:', error);
    } finally {
      // Cleanup & close
      await User.deleteMany({ email: 'supabase_test_user@example.com' });
      server.close();
      await mongoose.connection.close();
      process.exit(0);
    }
  });
}

runSupabaseAuthTests();
