import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const COS_URL = 'http://localhost:5000';
const SHOP_URL = 'http://localhost:5001';
const JWT_SECRET = process.env.JWT_SECRET || 'localkart_super_secret_jwt_key_change_in_production';

async function runPhase2GTest() {
  console.log('--- STARTING PHASE 2G FULL AUTHENTICATION & RBAC SECURITY AUDIT ---');
  try {
    // 1. Connection & Initial Setup
    console.log('1. Connecting directly to Atlas DB to verify connection...');
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    console.log('Atlas DB Connected Successfully!');

    // Fetch a real product & shop for testing
    const sampleProduct = await db.collection('products').findOne({ isAvailable: true });
    if (!sampleProduct) throw new Error('No available product found in Atlas DB');
    const productIdStr = sampleProduct._id.toString();
    const shopIdStr = (sampleProduct.shopId || sampleProduct.shop).toString();
    const initialStock = sampleProduct.stock;

    const targetShop = await db.collection('shops').findOne({ _id: new mongoose.Types.ObjectId(shopIdStr) });
    const shopkeeperUser = await db.collection('users').findOne({ _id: targetShop.userId });
    console.log(`Auditing with Target Shop: "${targetShop.name}", Owner: "${shopkeeperUser.email}"`);

    // 2. JWT Contract & Password Privacy Audit
    console.log('\n2. AUDITING JWT CONTRACT & PASSWORD PRIVACY...');

    // Customer Registration & Password Privacy Check
    const emailA = `cust_a_p2g_${Date.now()}@localkart.com`;
    const regResA = await fetch(`${COS_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Phase 2G Customer A',
        email: emailA,
        phone: `93${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'password123',
        otp: '123456',
        role: 'customer'
      })
    });
    const regDataA = await regResA.json();
    if (!regResA.ok) throw new Error(`Customer A registration failed: ${JSON.stringify(regDataA)}`);
    const tokenA = regDataA.token;
    const userA_id = regDataA._id;

    if (regDataA.password !== undefined) throw new Error('SECURITY VIOLATION: Password returned in registration response!');
    console.log('Customer registration response verified: Password is NOT exposed.');

    // Decode Customer Token
    const decodedCustToken = jwt.verify(tokenA, JWT_SECRET);
    console.log('Decoded Customer JWT Payload:', {
      userId: decodedCustToken.userId,
      id: decodedCustToken.id,
      email: decodedCustToken.email,
      role: decodedCustToken.role,
      name: decodedCustToken.name
    });
    if (!decodedCustToken.userId || !decodedCustToken.id || !decodedCustToken.email || !decodedCustToken.role || !decodedCustToken.name) {
      throw new Error('Customer JWT payload does not satisfy required contract fields');
    }

    // Shopkeeper Login & Password Privacy Check
    const shopLoginRes = await fetch(`${SHOP_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: shopkeeperUser.email, password: 'password123' })
    });
    const shopLoginData = await shopLoginRes.json();
    if (!shopLoginRes.ok) throw new Error(`Shopkeeper login failed: ${JSON.stringify(shopLoginData)}`);
    const tokenShopkeeperA = shopLoginData.data.token;

    if (shopLoginData.data.user.password !== undefined) throw new Error('SECURITY VIOLATION: Password returned in Shopkeeper login response!');
    console.log('Shopkeeper login response verified: Password is NOT exposed.');

    const decodedShopkeeperToken = jwt.verify(tokenShopkeeperA, JWT_SECRET);
    console.log('Decoded Shopkeeper JWT Payload:', {
      userId: decodedShopkeeperToken.userId,
      id: decodedShopkeeperToken.id,
      email: decodedShopkeeperToken.email,
      role: decodedShopkeeperToken.role,
      name: decodedShopkeeperToken.name
    });

    // Delivery Partner Login & Password Privacy Check
    let tokenDpA;
    const dpLoginRes = await fetch(`${SHOP_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'delivery@localkart.com', password: 'password123' })
    });
    if (dpLoginRes.ok) {
      const dpData = await dpLoginRes.json();
      tokenDpA = dpData.data.token;
      if (dpData.data.user.password !== undefined) throw new Error('SECURITY VIOLATION: Password returned in DP login response!');
    } else {
      const dpRegRes = await fetch(`${SHOP_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Phase 2G Delivery Runner',
          email: 'delivery@localkart.com',
          password: 'password123',
          phone: '9123456789',
          role: 'DELIVERY_PARTNER',
          vehicleType: 'MOTORCYCLE'
        })
      });
      const dpRegData = await dpRegRes.json();
      tokenDpA = dpRegData.data.token;
    }
    const decodedDpToken = jwt.verify(tokenDpA, JWT_SECRET);
    console.log('Decoded Delivery Partner JWT Payload:', {
      userId: decodedDpToken.userId,
      id: decodedDpToken.id,
      email: decodedDpToken.email,
      role: decodedDpToken.role,
      name: decodedDpToken.name
    });
    console.log('JWT CONTRACT & PASSWORD PRIVACY AUDIT PASSED 100%!');

    // 3. CUSTOMER PERMISSIONS AUDIT
    console.log('\n3. AUDITING CUSTOMER PERMISSIONS...');
    // Customer CAN access profile, cart, addresses, create & view order
    const custProfileRes = await fetch(`${COS_URL}/api/auth/me`, { headers: { 'Authorization': `Bearer ${tokenA}` } });
    if (!custProfileRes.ok) throw new Error('Customer cannot access own profile');

    const custCartRes = await fetch(`${COS_URL}/api/cart`, { headers: { 'Authorization': `Bearer ${tokenA}` } });
    if (!custCartRes.ok) throw new Error('Customer cannot access own cart');

    const custAddrRes = await fetch(`${COS_URL}/api/addresses`, { headers: { 'Authorization': `Bearer ${tokenA}` } });
    if (!custAddrRes.ok) throw new Error('Customer cannot access own addresses');

    const orderRes = await fetch(`${COS_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({
        orderItems: [{ product: productIdStr, qty: 1 }],
        deliveryAddress: { street: 'P2G Audit Street', city: 'Ara' },
        paymentMethod: 'COD'
      })
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok) throw new Error(`Customer failed to create order: ${JSON.stringify(orderData)}`);
    const orderIdA = orderData.order._id;

    const custMyOrdersRes = await fetch(`${COS_URL}/api/orders/myorders`, { headers: { 'Authorization': `Bearer ${tokenA}` } });
    if (!custMyOrdersRes.ok) throw new Error('Customer cannot view own orders');

    // Customer CANNOT manage products or shopkeeper APIs
    const custProdRes = await fetch(`${SHOP_URL}/api/products`, { headers: { 'Authorization': `Bearer ${tokenA}` } });
    console.log('Customer Access to Shopkeeper GET /api/products Status:', custProdRes.status);
    if (custProdRes.status !== 403 && custProdRes.status !== 401) throw new Error('SECURITY VIOLATION: Customer accessed Shopkeeper product API!');

    const custShopOrdersRes = await fetch(`${SHOP_URL}/api/orders`, { headers: { 'Authorization': `Bearer ${tokenA}` } });
    console.log('Customer Access to Shopkeeper GET /api/orders Status:', custShopOrdersRes.status);
    if (custShopOrdersRes.status !== 403 && custShopOrdersRes.status !== 401) throw new Error('SECURITY VIOLATION: Customer accessed Shopkeeper orders API!');

    const custDpRes = await fetch(`${SHOP_URL}/api/orders/delivery/available`, { headers: { 'Authorization': `Bearer ${tokenA}` } });
    console.log('Customer Access to Delivery Partner API Status:', custDpRes.status);
    if (custDpRes.status !== 403 && custDpRes.status !== 401) throw new Error('SECURITY VIOLATION: Customer accessed Delivery Partner API!');

    // Customer B cannot access Customer A's order
    const emailB = `cust_b_p2g_${Date.now()}@localkart.com`;
    const regResB = await fetch(`${COS_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Phase 2G Customer B',
        email: emailB,
        phone: `92${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'password123',
        otp: '123456',
        role: 'customer'
      })
    });
    const regDataB = await regResB.json();
    const tokenB = regDataB.token;
    const userB_id = regDataB._id;

    const custBViewOrderRes = await fetch(`${COS_URL}/api/orders/${orderIdA}`, { headers: { 'Authorization': `Bearer ${tokenB}` } });
    console.log('Customer B Access to Customer A Order Status:', custBViewOrderRes.status);
    if (custBViewOrderRes.status !== 403 && custBViewOrderRes.status !== 404) throw new Error('SECURITY VIOLATION: Customer B accessed Customer A order!');

    console.log('CUSTOMER PERMISSIONS & ISOLATION AUDIT PASSED 100%!');

    // 4. SHOPKEEPER PERMISSIONS AUDIT
    console.log('\n4. AUDITING SHOPKEEPER PERMISSIONS...');
    // Shopkeeper A CAN access own shop products and orders
    const shopProdsRes = await fetch(`${SHOP_URL}/api/products`, { headers: { 'Authorization': `Bearer ${tokenShopkeeperA}` } });
    if (!shopProdsRes.ok) throw new Error('Shopkeeper A cannot access own products');

    const shopOrdersRes = await fetch(`${SHOP_URL}/api/orders`, { headers: { 'Authorization': `Bearer ${tokenShopkeeperA}` } });
    if (!shopOrdersRes.ok) throw new Error('Shopkeeper A cannot access shop orders');

    // Register Shopkeeper B with separate shop
    const shopBEmail = `shop_b_p2g_${Date.now()}@localkart.com`;
    const regShopBRes = await fetch(`${SHOP_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Shopkeeper B',
        email: shopBEmail,
        password: 'password123',
        phone: `91${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: 'SHOPKEEPER',
        shopName: 'Audit Shop B',
        shopAddress: 'Audit Street 88'
      })
    });
    const regShopBData = await regShopBRes.json();
    const tokenShopB = regShopBData.data.token;
    const userShopB_id = regShopBData.data.user.id;

    // Shopkeeper B CANNOT modify Shopkeeper A product
    const shopBModProdRes = await fetch(`${SHOP_URL}/api/products/${productIdStr}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenShopB}` },
      body: JSON.stringify({ price: 9999 })
    });
    console.log('Shopkeeper B Modify Shopkeeper A Product Status:', shopBModProdRes.status);
    if (shopBModProdRes.status !== 404 && shopBModProdRes.status !== 403) throw new Error('SECURITY VIOLATION: Shopkeeper B modified Shopkeeper A product!');

    // Shopkeeper B CANNOT accept/reject Shopkeeper A order
    const shopBAcceptRes = await fetch(`${SHOP_URL}/api/orders/${orderIdA}/accept`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenShopB}` }
    });
    console.log('Shopkeeper B Accept Shopkeeper A Order Status:', shopBAcceptRes.status);
    if (shopBAcceptRes.status !== 404 && shopBAcceptRes.status !== 403) throw new Error('SECURITY VIOLATION: Shopkeeper B modified Shopkeeper A order!');

    // Shopkeeper CANNOT perform Delivery Partner operations
    const shopDpPickupRes = await fetch(`${SHOP_URL}/api/orders/${orderIdA}/pickup`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenShopkeeperA}` }
    });
    console.log('Shopkeeper Pickup Order Status:', shopDpPickupRes.status);
    if (shopDpPickupRes.status !== 403 && shopDpPickupRes.status !== 401) throw new Error('SECURITY VIOLATION: Shopkeeper performed Delivery Partner operation!');

    console.log('SHOPKEEPER PERMISSIONS & ISOLATION AUDIT PASSED 100%!');

    // 5. DELIVERY PARTNER PERMISSIONS AUDIT
    console.log('\n5. AUDITING DELIVERY PARTNER PERMISSIONS...');
    // Shopkeeper A accepts order first
    await fetch(`${SHOP_URL}/api/orders/${orderIdA}/accept`, { method: 'PUT', headers: { 'Authorization': `Bearer ${tokenShopkeeperA}` } });

    // DP A CAN view available, pickup, and update delivery status
    const dpAvailRes = await fetch(`${SHOP_URL}/api/orders/delivery/available`, { headers: { 'Authorization': `Bearer ${tokenDpA}` } });
    if (!dpAvailRes.ok) throw new Error('Delivery Partner cannot view available orders');

    const dpPickupRes = await fetch(`${SHOP_URL}/api/orders/${orderIdA}/pickup`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenDpA}` }
    });
    if (!dpPickupRes.ok) throw new Error('Delivery Partner failed to pickup order');

    const dpStatusRes = await fetch(`${SHOP_URL}/api/orders/${orderIdA}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenDpA}` },
      body: JSON.stringify({ status: 'InTransit' })
    });
    if (!dpStatusRes.ok) throw new Error('Delivery Partner failed to update status');

    // Register Delivery Partner B for isolation check
    const dpBEmail = `dp_b_p2g_${Date.now()}@localkart.com`;
    const regDpBRes = await fetch(`${SHOP_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Delivery Partner B',
        email: dpBEmail,
        password: 'password123',
        phone: `90${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: 'DELIVERY_PARTNER',
        vehicleType: 'MOTORCYCLE'
      })
    });
    const regDpBData = await regDpBRes.json();
    const tokenDpB = regDpBData.data.token;
    const userDpB_id = regDpBData.data.user.id;

    // DP B CANNOT update DP A assigned order
    const dpBStatusRes = await fetch(`${SHOP_URL}/api/orders/${orderIdA}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenDpB}` },
      body: JSON.stringify({ status: 'Delivered' })
    });
    console.log('DP B Update DP A Assigned Order Status:', dpBStatusRes.status);
    if (dpBStatusRes.status !== 404 && dpBStatusRes.status !== 403) throw new Error('SECURITY VIOLATION: DP B modified DP A assigned order!');

    // DP CANNOT manage products or inventory
    const dpProdRes = await fetch(`${SHOP_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenDpA}` },
      body: JSON.stringify({ name: 'Hacked Item', price: 10, category: 'Test' })
    });
    console.log('Delivery Partner Create Product Status:', dpProdRes.status);
    if (dpProdRes.status !== 403 && dpProdRes.status !== 401) throw new Error('SECURITY VIOLATION: Delivery Partner accessed Product creation API!');

    console.log('DELIVERY PARTNER PERMISSIONS & ISOLATION AUDIT PASSED 100%!');

    // 6. SECURITY EDGE CASES AUDIT
    console.log('\n6. AUDITING SECURITY EDGE CASES...');

    // 6a. Missing Authorization Header
    const noHeaderRes = await fetch(`${COS_URL}/api/auth/me`);
    console.log('Missing Auth Header Status:', noHeaderRes.status);
    if (noHeaderRes.status !== 401) throw new Error('Missing Auth header should return 401');

    // 6b. Malformed Bearer token
    const malformedRes = await fetch(`${COS_URL}/api/auth/me`, { headers: { 'Authorization': 'Bearer malformed.token.xyz' } });
    console.log('Malformed Token Status:', malformedRes.status);
    if (malformedRes.status !== 401) throw new Error('Malformed token should return 401');

    // 6c. Invalid JWT Signature
    const fakeToken = jwt.sign({ id: userA_id }, 'WRONG_SECRET');
    const invalidSigRes = await fetch(`${COS_URL}/api/auth/me`, { headers: { 'Authorization': `Bearer ${fakeToken}` } });
    console.log('Invalid Signature Status:', invalidSigRes.status);
    if (invalidSigRes.status !== 401) throw new Error('Invalid signature token should return 401');

    // 6d. Token referencing Nonexistent User
    const nonUserToken = jwt.sign({ userId: '600000000000000000000000', id: '600000000000000000000000', role: 'customer' }, JWT_SECRET);
    const nonUserRes = await fetch(`${COS_URL}/api/auth/me`, { headers: { 'Authorization': `Bearer ${nonUserToken}` } });
    console.log('Nonexistent User Token Status:', nonUserRes.status);
    if (nonUserRes.status !== 401 && nonUserRes.status !== 404) throw new Error('Nonexistent user token should return 401 or 404');

    // 6e. Invalid Hex User / Order IDs
    const invalidIdRes = await fetch(`${COS_URL}/api/orders/invalid-hex-id-xyz`, { headers: { 'Authorization': `Bearer ${tokenA}` } });
    console.log('Invalid Hex ID Status:', invalidIdRes.status);
    if (invalidIdRes.status !== 404 && invalidIdRes.status !== 400) throw new Error('Invalid Hex ID should return 404 or 400');

    console.log('ALL SECURITY EDGE CASES AUDITED & PASSED 100%!');

    // 7. CLEANUP
    console.log('\n7. CLEANING UP TEST DATA...');
    await db.collection('orders').deleteOne({ _id: new mongoose.Types.ObjectId(orderIdA) });
    await db.collection('order_items').deleteMany({ orderId: new mongoose.Types.ObjectId(orderIdA) });

    await db.collection('products').updateOne({ _id: sampleProduct._id }, { $set: { stock: initialStock } });
    console.log('Product stock restored.');

    await db.collection('users').deleteMany({
      _id: {
        $in: [
          new mongoose.Types.ObjectId(userA_id),
          new mongoose.Types.ObjectId(userB_id),
          new mongoose.Types.ObjectId(userShopB_id),
          new mongoose.Types.ObjectId(userDpB_id)
        ]
      }
    });
    await db.collection('shops').deleteOne({ userId: new mongoose.Types.ObjectId(userShopB_id) });
    await db.collection('delivery_partners').deleteOne({ userId: new mongoose.Types.ObjectId(userDpB_id) });

    console.log('All test users, test orders, test order_items, test shops, and test delivery partner profiles cleaned up from Atlas.');

    console.log('\nPHASE 2G FULL AUTHENTICATION & RBAC SECURITY AUDIT COMPLETED SUCCESSFULLY WITH 100% PASS!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\nE2E AUDIT ERROR:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runPhase2GTest();
