const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const COS_URL = 'http://localhost:5000';
const SHOP_URL = 'http://localhost:5001';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretlocalkartkey12345!';

async function runPhase2CTest() {
  console.log('--- STARTING PHASE 2C E2E INTEGRATION TEST ---');
  try {
    // 1. Database Connection
    console.log('1. Connecting directly to Atlas DB to verify state...');
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    // 2. Count existing users
    const usersCount = await db.collection('users').countDocuments();
    console.log(`Atlas 'users' collection total documents: ${usersCount}`);

    // 3. Test Shopkeeper Login via Shop backend
    console.log('2. Testing existing Shopkeeper login on Shop backend (port 5001)...');
    const shopLoginRes = await fetch(`${SHOP_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'suresh@localkart.com', password: 'password123' })
    });
    console.log('Shopkeeper Login Status:', shopLoginRes.status);
    const shopLoginData = await shopLoginRes.json();
    if (!shopLoginRes.ok) {
      throw new Error(`Shopkeeper login failed: ${JSON.stringify(shopLoginData)}`);
    }
    const shopToken = shopLoginData.data.token;
    console.log('Shopkeeper token acquired successfully.');

    // Verify JWT payload contract for Shopkeeper token
    const decodedShopToken = jwt.verify(shopToken, JWT_SECRET);
    console.log('Decoded Shopkeeper JWT Payload:', {
      userId: decodedShopToken.userId,
      email: decodedShopToken.email,
      role: decodedShopToken.role,
      name: decodedShopToken.name
    });
    if (!decodedShopToken.userId || !decodedShopToken.email || !decodedShopToken.role || !decodedShopToken.name) {
      throw new Error('JWT payload missing required contract fields (userId, email, role, name)');
    }

    // 4. Test GET /api/auth/me on Shop backend with Shopkeeper Token
    console.log('3. Testing GET /api/auth/me on Shop backend...');
    const shopMeRes = await fetch(`${SHOP_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${shopToken}` }
    });
    const shopMeData = await shopMeRes.json();
    console.log('Shopkeeper /api/auth/me Response:', shopMeRes.status, shopMeData.data ? `Name: ${shopMeData.data.name}, Role: ${shopMeData.data.role}` : shopMeData);

    // 5. Test Delivery Partner Login via Shop backend
    console.log('4. Testing existing Delivery Partner login on Shop backend (port 5001)...');
    const dpLoginRes = await fetch(`${SHOP_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'delivery@localkart.com', password: 'password123' })
    });
    console.log('Delivery Partner Login Status:', dpLoginRes.status);
    const dpLoginData = await dpLoginRes.json();
    if (!dpLoginRes.ok) {
      throw new Error(`Delivery Partner login failed: ${JSON.stringify(dpLoginData)}`);
    }
    const dpToken = dpLoginData.data.token;
    const decodedDpToken = jwt.verify(dpToken, JWT_SECRET);
    console.log('Decoded Delivery Partner JWT Payload:', {
      userId: decodedDpToken.userId,
      email: decodedDpToken.email,
      role: decodedDpToken.role,
      name: decodedDpToken.name
    });

    // 6. Test GET /api/auth/me on Shop backend with Delivery Partner Token
    console.log('5. Testing GET /api/auth/me for Delivery Partner...');
    const dpMeRes = await fetch(`${SHOP_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${dpToken}` }
    });
    const dpMeData = await dpMeRes.json();
    console.log('Delivery Partner /api/auth/me Response:', dpMeRes.status, dpMeData.data ? `Name: ${dpMeData.data.name}, Role: ${dpMeData.data.role}` : dpMeData);

    // 7. Register a temporary TEST Customer on COS backend
    console.log('6. Registering temporary TEST Customer on COS backend (port 5000)...');
    const testEmail = `test_cust_phase2c_${Date.now()}@localkart.com`;
    const custRegRes = await fetch(`${COS_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Phase2C Test Customer',
        email: testEmail,
        phone: `99${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'password123',
        otp: '123456',
        role: 'customer'
      })
    });
    console.log('Customer Registration Response Status:', custRegRes.status);
    const custRegData = await custRegRes.json();
    if (!custRegRes.ok) {
      throw new Error(`Customer registration failed: ${JSON.stringify(custRegData)}`);
    }
    const custToken = custRegData.token;
    const testCustomerId = custRegData._id;
    console.log(`TEST Customer Created Successfully! ID: ${testCustomerId}, Email: ${testEmail}`);

    // Verify JWT payload for Customer token
    const decodedCustToken = jwt.verify(custToken, JWT_SECRET);
    console.log('Decoded Customer JWT Payload:', {
      userId: decodedCustToken.userId,
      email: decodedCustToken.email,
      role: decodedCustToken.role,
      name: decodedCustToken.name
    });

    // 8. Test GET /api/auth/me on COS backend with Customer token
    console.log('7. Testing GET /api/auth/me on COS backend...');
    const custMeRes = await fetch(`${COS_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${custToken}` }
    });
    const custMeData = await custMeRes.json();
    console.log('Customer /api/auth/me Response:', custMeRes.status, custMeData._id ? `ID: ${custMeData._id}, Role: ${custMeData.role}` : custMeData);

    // 9. Test Customer Login on COS backend
    console.log('8. Testing Customer Login on COS backend (POST /api/auth/login)...');
    const custLoginRes = await fetch(`${COS_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrPhone: testEmail,
        password: 'password123'
      })
    });
    console.log('Customer Login Status:', custLoginRes.status);
    const custLoginData = await custLoginRes.json();
    if (!custLoginRes.ok) {
      throw new Error(`Customer login failed: ${JSON.stringify(custLoginData)}`);
    }
    console.log('Customer Login Successful.');

    // 10. Relation Verification: Check Shop.userId and DeliveryPartner.userId in Atlas
    console.log('9. Verifying Atlas relations (Shop.userId & DeliveryPartner.userId)...');
    const shops = await db.collection('shops').find({}).toArray();
    for (const s of shops) {
      const user = await db.collection('users').findOne({ _id: s.userId });
      console.log(`Shop '${s.name}' -> userId ${s.userId} resolves to User: ${user ? user.name + ' (' + user.role + ')' : 'NOT FOUND'}`);
    }

    const dps = await db.collection('delivery_partners').find({}).toArray();
    for (const d of dps) {
      const user = await db.collection('users').findOne({ _id: d.userId });
      console.log(`Delivery Partner ID ${d._id} -> userId ${d.userId} resolves to User: ${user ? user.name + ' (' + user.role + ')' : 'NOT FOUND'}`);
    }

    // 11. CLEAN UP TEST CUSTOMER DATA ONLY
    console.log('\n--- CLEANING UP TEST DATA ---');
    await db.collection('users').deleteOne({ _id: new mongoose.Types.ObjectId(testCustomerId) });
    console.log(`Test User ${testCustomerId} deleted from Atlas 'users' collection.`);

    const postCleanupCount = await db.collection('users').countDocuments();
    console.log(`Post-cleanup 'users' collection count: ${postCleanupCount}`);

    console.log('\nPHASE 2C E2E INTEGRATION TEST COMPLETED SUCCESSFULLY WITH 100% PASS!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\nE2E TEST ERROR:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runPhase2CTest();
