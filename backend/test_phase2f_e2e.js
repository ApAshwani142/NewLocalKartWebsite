const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const COS_URL = 'http://localhost:5000';
const SHOP_URL = 'http://localhost:5001';

async function runPhase2FTest() {
  console.log('--- STARTING PHASE 2F E2E INTEGRATION TEST ---');
  try {
    // 1. Connection & Initial Stock Record
    console.log('1. Connecting directly to Atlas DB to verify connection & initial stock...');
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    const sampleProduct = await db.collection('products').findOne({ isAvailable: true });
    if (!sampleProduct) throw new Error('No available product found in Atlas DB');
    const initialStock = sampleProduct.stock;
    const productIdStr = sampleProduct._id.toString();
    const shopIdStr = (sampleProduct.shopId || sampleProduct.shop).toString();

    console.log(`Target Product: "${sampleProduct.name}" (ID: ${productIdStr})`);
    console.log(`Initial Stock in Atlas: ${initialStock}`);
    console.log(`Shop ID: ${shopIdStr}`);

    const shopDoc = await db.collection('shops').findOne({ _id: new mongoose.Types.ObjectId(shopIdStr) });
    if (!shopDoc) throw new Error(`Shop ${shopIdStr} not found in Atlas`);
    const shopkeeperUser = await db.collection('users').findOne({ _id: shopDoc.userId });
    if (!shopkeeperUser) throw new Error(`Shopkeeper user ${shopDoc.userId} not found in Atlas`);
    console.log(`Shopkeeper Email: ${shopkeeperUser.email}`);

    // 2. Register Customer A
    console.log('\n2. Registering Customer A on COS backend...');
    const emailA = `test_cust_p2f_${Date.now()}@localkart.com`;
    const regResA = await fetch(`${COS_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Phase 2F Customer',
        email: emailA,
        phone: `94${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'password123',
        otp: '123456',
        role: 'customer'
      })
    });
    const regDataA = await regResA.json();
    if (!regResA.ok) throw new Error(`Customer registration failed: ${JSON.stringify(regDataA)}`);
    const tokenA = regDataA.token;
    const userA_id = regDataA._id;
    console.log(`Customer A registered! ID: ${userA_id}`);

    // 3. Customer Order -> Stock Deduction
    console.log('\n3. Placing Customer Order for 2 units via COS API (POST /api/orders)...');
    const orderRes1 = await fetch(`${COS_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        orderItems: [{ product: productIdStr, qty: 2 }],
        deliveryAddress: { street: 'Phase 2F Main Street', city: 'Ara' },
        paymentMethod: 'COD'
      })
    });
    const orderData1 = await orderRes1.json();
    if (!orderRes1.ok) throw new Error(`Order placement failed: ${JSON.stringify(orderData1)}`);
    const orderId1 = orderData1.order._id;
    console.log(`Order #1 Created! ID: ${orderId1}`);

    // Verify stock decrease in Atlas
    const prodAfterOrder1 = await db.collection('products').findOne({ _id: sampleProduct._id });
    console.log(`Stock in Atlas after Order #1 (2 units): ${prodAfterOrder1.stock} (Expected: ${initialStock - 2})`);
    if (prodAfterOrder1.stock !== initialStock - 2) {
      throw new Error(`Stock deduction mismatch! Expected ${initialStock - 2}, got ${prodAfterOrder1.stock}`);
    }

    // Verify Shopkeeper API sees exact same stock value
    console.log('Shopkeeper authenticating on Shop backend (port 5001)...');
    const shopLoginRes = await fetch(`${SHOP_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: shopkeeperUser.email, password: 'password123' })
    });
    const shopLoginData = await shopLoginRes.json();
    const shopToken = shopLoginData.data.token;

    console.log('Fetching product details via Shopkeeper API (GET /api/products/:id)...');
    const shopProdRes = await fetch(`${SHOP_URL}/api/products/${productIdStr}`, {
      headers: { 'Authorization': `Bearer ${shopToken}` }
    });
    const shopProdData = await shopProdRes.json();
    console.log('Shopkeeper API reported product stock:', shopProdData.data.stock);
    if (shopProdData.data.stock !== prodAfterOrder1.stock) {
      throw new Error('Shopkeeper API reported stock value differs from Atlas DB!');
    }

    // Verify inventory log written
    const latestLog1 = await db.collection('inventory_logs').findOne({ productId: sampleProduct._id }, { sort: { createdAt: -1 } });
    console.log('Latest inventory_logs entry in Atlas:', {
      _id: latestLog1._id.toString(),
      changeAmount: latestLog1.changeAmount,
      reason: latestLog1.reason,
      stockBefore: latestLog1.stockBefore,
      stockAfter: latestLog1.stockAfter
    });
    if (latestLog1.changeAmount !== -2) throw new Error('inventory_logs changeAmount mismatch');

    // 4. PREVENT INVALID STOCK & OVER-ORDERING
    console.log('\n4. TESTING INVALID QUANTITIES & OVER-ORDERING PREVENTIONS...');

    // 4a. Order quantity > available stock
    console.log('4a. Attempting to order quantity > available stock (99999 units)...');
    const overStockRes = await fetch(`${COS_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        orderItems: [{ product: productIdStr, qty: 99999 }],
        deliveryAddress: { street: 'Phase 2F Main Street', city: 'Ara' }
      })
    });
    console.log('Over-stock Request Response Status:', overStockRes.status);
    if (overStockRes.status !== 400) throw new Error(`Over-stock request should return 400! Got: ${overStockRes.status}`);

    // 4b. Zero quantity
    console.log('4b. Attempting to order zero quantity (qty: 0)...');
    const zeroQtyRes = await fetch(`${COS_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        orderItems: [{ product: productIdStr, qty: 0 }],
        deliveryAddress: { street: 'Phase 2F Main Street', city: 'Ara' }
      })
    });
    console.log('Zero Quantity Response Status:', zeroQtyRes.status);
    if (zeroQtyRes.status !== 400) throw new Error(`Zero quantity request should return 400! Got: ${zeroQtyRes.status}`);

    // 4c. Negative quantity
    console.log('4c. Attempting to order negative quantity (qty: -5)...');
    const negQtyRes = await fetch(`${COS_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        orderItems: [{ product: productIdStr, qty: -5 }],
        deliveryAddress: { street: 'Phase 2F Main Street', city: 'Ara' }
      })
    });
    console.log('Negative Quantity Response Status:', negQtyRes.status);
    if (negQtyRes.status !== 400) throw new Error(`Negative quantity request should return 400! Got: ${negQtyRes.status}`);

    // 4d. Nonexistent product ID
    console.log('4d. Attempting to order nonexistent product ID...');
    const nonExistProdRes = await fetch(`${COS_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        orderItems: [{ product: '600000000000000000000000', qty: 1 }],
        deliveryAddress: { street: 'Phase 2F Main Street', city: 'Ara' }
      })
    });
    console.log('Nonexistent Product Response Status:', nonExistProdRes.status);
    if (nonExistProdRes.status !== 404) throw new Error(`Nonexistent product request should return 404! Got: ${nonExistProdRes.status}`);

    // Confirm stock in Atlas was NOT changed by invalid requests
    const prodAfterInvalid = await db.collection('products').findOne({ _id: sampleProduct._id });
    console.log(`Stock in Atlas after invalid requests: ${prodAfterInvalid.stock}`);
    if (prodAfterInvalid.stock !== prodAfterOrder1.stock) {
      throw new Error('Stock was corrupted by invalid request!');
    }

    // 5. ORDER CANCELLATION & STOCK RESTORATION
    console.log('\n5. TESTING ORDER CANCELLATION & STOCK RESTORATION...');

    // Place Order #2 for 3 units
    console.log('Customer A placing Order #2 for 3 units...');
    const orderRes2 = await fetch(`${COS_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        orderItems: [{ product: productIdStr, qty: 3 }],
        deliveryAddress: { street: 'Phase 2F Main Street', city: 'Ara' },
        paymentMethod: 'COD'
      })
    });
    const orderData2 = await orderRes2.json();
    const orderId2 = orderData2.order._id;
    const stockAfterOrder2 = (await db.collection('products').findOne({ _id: sampleProduct._id })).stock;
    console.log(`Order #2 Created (ID: ${orderId2}). Stock after Order #2: ${stockAfterOrder2}`);

    // Shopkeeper rejects Order #2 via Shop backend
    console.log('Shopkeeper rejecting Order #2 via Shop backend (PUT /api/orders/:id/reject)...');
    const rejectRes = await fetch(`${SHOP_URL}/api/orders/${orderId2}/reject`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${shopToken}` }
    });
    console.log('Reject Response Status:', rejectRes.status);
    if (!rejectRes.ok) throw new Error(`Order rejection failed: ${await rejectRes.text()}`);

    // Verify stock restored in Atlas
    const stockAfterReject = (await db.collection('products').findOne({ _id: sampleProduct._id })).stock;
    console.log(`Stock in Atlas after Order #2 Rejection: ${stockAfterReject} (Expected: ${stockAfterOrder2 + 3})`);
    if (stockAfterReject !== stockAfterOrder2 + 3) {
      throw new Error(`Stock restoration mismatch! Expected ${stockAfterOrder2 + 3}, got ${stockAfterReject}`);
    }

    // Verify cancellation inventory log in Atlas
    const rejectLog = await db.collection('inventory_logs').findOne({ reason: `Order Rejection #${orderId2}` });
    if (!rejectLog) throw new Error('Inventory log for rejection not found');
    console.log('Rejection Inventory Log verified:', {
      changeAmount: rejectLog.changeAmount,
      reason: rejectLog.reason,
      stockBefore: rejectLog.stockBefore,
      stockAfter: rejectLog.stockAfter
    });

    // Test Double-Restock Prevention
    console.log('Testing Double-Restock Prevention: Attempting to reject Order #2 a second time...');
    const doubleRejectRes = await fetch(`${SHOP_URL}/api/orders/${orderId2}/reject`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${shopToken}` }
    });
    console.log('Double Reject Response Status:', doubleRejectRes.status);
    if (doubleRejectRes.status !== 400) throw new Error('Double reject request should return 400!');

    const stockAfterDoubleReject = (await db.collection('products').findOne({ _id: sampleProduct._id })).stock;
    console.log(`Stock after double reject attempt: ${stockAfterDoubleReject}`);
    if (stockAfterDoubleReject !== stockAfterReject) {
      throw new Error('DOUBLE RESTOCK DETECTED! Stock was incremented twice for the same cancelled order!');
    }
    console.log('DOUBLE RESTOCK PREVENTION VERIFIED! Stock is 100% safe.');

    // 6. SHOPKEEPER SECURITY & AUTHORIZATION
    console.log('\n6. TESTING SHOPKEEPER SECURITY & AUTHORIZATION...');
    console.log('Registering Shopkeeper B with separate shop for security testing...');
    const shopBEmail = `shop_b_p2f_${Date.now()}@localkart.com`;
    const regShopBRes = await fetch(`${SHOP_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Shopkeeper B',
        email: shopBEmail,
        password: 'password123',
        phone: `93${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: 'SHOPKEEPER',
        shopName: 'Unrelated Shop B',
        shopAddress: 'Unrelated Street 99'
      })
    });
    const regShopBData = await regShopBRes.json();
    const tokenShopB = regShopBData.data.token;
    const userShopB_id = regShopBData.data.user.id;

    console.log('Shopkeeper B attempting to modify Shopkeeper A product stock (PUT /api/products/:id)...');
    const unauthorizedUpdateRes = await fetch(`${SHOP_URL}/api/products/${productIdStr}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenShopB}`
      },
      body: JSON.stringify({ stock: 999 })
    });
    console.log('Shopkeeper B Update Stock Response Status:', unauthorizedUpdateRes.status);
    if (unauthorizedUpdateRes.status !== 404 && unauthorizedUpdateRes.status !== 403) {
      throw new Error(`SECURITY VIOLATION: Shopkeeper B was able to modify Shopkeeper A product stock! Status: ${unauthorizedUpdateRes.status}`);
    }

    console.log('Shopkeeper B attempting to delete Shopkeeper A product (DELETE /api/products/:id)...');
    const unauthorizedDeleteRes = await fetch(`${SHOP_URL}/api/products/${productIdStr}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${tokenShopB}` }
    });
    console.log('Shopkeeper B Delete Product Response Status:', unauthorizedDeleteRes.status);
    if (unauthorizedDeleteRes.status !== 404 && unauthorizedDeleteRes.status !== 403) {
      throw new Error(`SECURITY VIOLATION: Shopkeeper B was able to delete Shopkeeper A product! Status: ${unauthorizedDeleteRes.status}`);
    }

    console.log('Customer A attempting to access Shopkeeper product management APIs...');
    const custProdAccessRes = await fetch(`${SHOP_URL}/api/products/${productIdStr}`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    console.log('Customer Access to Shopkeeper API Status:', custProdAccessRes.status);
    if (custProdAccessRes.status !== 403 && custProdAccessRes.status !== 401) {
      throw new Error('SECURITY VIOLATION: Customer was able to access Shopkeeper product APIs!');
    }
    console.log('SHOPKEEPER INVENTORY SECURITY VERIFIED 100%!');

    // 7. CROSS-BACKEND CONSISTENCY & REFERENCE INTEGRITY
    console.log('\n7. VERIFYING CROSS-BACKEND CONSISTENCY & REFERENCE INTEGRITY...');
    const allLogs = await db.collection('inventory_logs').find({ productId: sampleProduct._id }).toArray();
    console.log(`Total inventory_logs found for product ${productIdStr}: ${allLogs.length}`);
    for (const log of allLogs) {
      const parentProd = await db.collection('products').findOne({ _id: log.productId });
      if (!parentProd) throw new Error(`Orphan inventory log detected for productId: ${log.productId}`);
    }
    console.log('Reference integrity verified. Zero orphan inventory logs.');

    // 8. TEST CLEANUP
    console.log('\n8. CLEANING UP TEST DATA...');
    // Delete test orders & test items
    await db.collection('orders').deleteMany({ _id: { $in: [new mongoose.Types.ObjectId(orderId1), new mongoose.Types.ObjectId(orderId2)] } });
    await db.collection('order_items').deleteMany({ orderId: { $in: [new mongoose.Types.ObjectId(orderId1), new mongoose.Types.ObjectId(orderId2)] } });
    await db.collection('inventory_logs').deleteMany({ reason: { $regex: /Customer Order|Order Rejection/ } });

    // Restore initial stock value
    await db.collection('products').updateOne({ _id: sampleProduct._id }, { $set: { stock: initialStock } });
    const restoredProd = await db.collection('products').findOne({ _id: sampleProduct._id });
    console.log(`Product stock restored to original value: ${restoredProd.stock}`);

    // Delete test users & shopkeeper B profiles
    await db.collection('users').deleteMany({
      _id: { $in: [new mongoose.Types.ObjectId(userA_id), new mongoose.Types.ObjectId(userShopB_id)] }
    });
    await db.collection('shops').deleteOne({ userId: new mongoose.Types.ObjectId(userShopB_id) });

    console.log('All test orders, inventory logs, test users, and test shop profiles cleaned up from Atlas.');

    console.log('\nPHASE 2F E2E INTEGRATION TEST COMPLETED SUCCESSFULLY WITH 100% PASS!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\nE2E TEST ERROR:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runPhase2FTest();
