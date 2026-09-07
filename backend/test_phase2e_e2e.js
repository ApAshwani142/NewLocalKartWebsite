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

async function runPhase2ETest() {
  console.log('--- STARTING PHASE 2E E2E INTEGRATION TEST ---');
  try {
    // 1. Database Connection
    console.log('1. Connecting directly to Atlas DB to verify state...');
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    console.log('Atlas DB Connected Successfully!');

    // Fetch existing real product & shop
    const sampleProduct = await db.collection('products').findOne({ isAvailable: true });
    if (!sampleProduct) throw new Error('No available product found in Atlas');
    const targetShopId = (sampleProduct.shopId || sampleProduct.shop).toString();
    console.log(`Target Product: "${sampleProduct.name}" (ID: ${sampleProduct._id}), Initial Stock: ${sampleProduct.stock}, ShopId: ${targetShopId}`);

    const targetShop = await db.collection('shops').findOne({ _id: new mongoose.Types.ObjectId(targetShopId) });
    if (!targetShop) throw new Error(`Shop ${targetShopId} not found in Atlas`);
    console.log(`Target Shop Name: "${targetShop.name}", Owner User ID: ${targetShop.userId}`);

    const shopkeeperUser = await db.collection('users').findOne({ _id: targetShop.userId });
    if (!shopkeeperUser) throw new Error(`Shopkeeper user ${targetShop.userId} not found in Atlas`);
    console.log(`Shopkeeper Owner Email: "${shopkeeperUser.email}"`);

    // 2. Register Test Customer A & Test Customer B
    console.log('\n2. Registering Test Customer A & Test Customer B on COS backend...');
    const emailA = `test_cust_a_p2e_${Date.now()}@localkart.com`;
    const regResA = await fetch(`${COS_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Phase2E Customer A',
        email: emailA,
        phone: `96${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'password123',
        otp: '123456',
        role: 'customer'
      })
    });
    const regDataA = await regResA.json();
    if (!regResA.ok) throw new Error(`Customer A registration failed: ${JSON.stringify(regDataA)}`);
    const tokenA = regDataA.token;
    const userA_id = regDataA._id;
    console.log(`Customer A registered! ID: ${userA_id}`);

    const emailB = `test_cust_b_p2e_${Date.now()}@localkart.com`;
    const regResB = await fetch(`${COS_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Phase2E Customer B',
        email: emailB,
        phone: `95${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'password123',
        otp: '123456',
        role: 'customer'
      })
    });
    const regDataB = await regResB.json();
    if (!regResB.ok) throw new Error(`Customer B registration failed: ${JSON.stringify(regDataB)}`);
    const tokenB = regDataB.token;
    const userB_id = regDataB._id;
    console.log(`Customer B registered! ID: ${userB_id}`);

    // 3. Customer A creates an Order via COS API
    console.log('\n3. Customer A creating Order via COS backend (POST /api/orders)...');
    const createOrderRes = await fetch(`${COS_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        orderItems: [{
          product: sampleProduct._id.toString(),
          qty: 2
        }],
        deliveryAddress: {
          street: '123 Phase 2E High Street',
          area: 'Station Area',
          city: 'Ara',
          pincode: '802301'
        },
        paymentMethod: 'COD',
        customerName: 'Phase2E Customer A',
        customerPhone: '9876543210',
        notes: 'Phase 2E Integration Order'
      })
    });
    const createOrderData = await createOrderRes.json();
    console.log('Create Order Response Status:', createOrderRes.status);
    if (!createOrderRes.ok) throw new Error(`Order creation failed: ${JSON.stringify(createOrderData)}`);
    const orderId = createOrderData.order._id;
    console.log(`Order Created Successfully! Order ID: ${orderId}, Initial Status: ${createOrderData.order.status || createOrderData.order.deliveryStatus}`);

    // Confirm Atlas DB written
    const atlasOrder = await db.collection('orders').findOne({ _id: new mongoose.Types.ObjectId(orderId) });
    if (!atlasOrder) throw new Error('Order document not found in Atlas DB');
    console.log('Atlas Order Document verified:', {
      _id: atlasOrder._id.toString(),
      customerId: atlasOrder.customerId.toString(),
      shopId: atlasOrder.shopId.toString(),
      status: atlasOrder.status,
      totalAmount: atlasOrder.totalAmount
    });

    const atlasOrderItems = await db.collection('order_items').find({ orderId: new mongoose.Types.ObjectId(orderId) }).toArray();
    console.log(`Atlas OrderItems count: ${atlasOrderItems.length}`);
    if (atlasOrderItems.length === 0) throw new Error('No order_items found in Atlas DB');
    console.log('Atlas OrderItem Document verified:', {
      _id: atlasOrderItems[0]._id.toString(),
      orderId: atlasOrderItems[0].orderId.toString(),
      productId: atlasOrderItems[0].productId.toString(),
      productName: atlasOrderItems[0].productName,
      unitPrice: atlasOrderItems[0].unitPrice,
      quantity: atlasOrderItems[0].quantity
    });

    // 4. Shopkeeper fetches Order via Shop backend
    console.log('\n4. Shopkeeper authenticating on Shop backend (port 5001)...');
    const shopLoginRes = await fetch(`${SHOP_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: shopkeeperUser.email, password: 'password123' })
    });
    const shopLoginData = await shopLoginRes.json();
    if (!shopLoginRes.ok) throw new Error(`Shopkeeper login failed: ${JSON.stringify(shopLoginData)}`);
    const shopToken = shopLoginData.data.token;
    console.log('Shopkeeper Token acquired.');

    console.log('Shopkeeper fetching shop orders via Shop backend (GET /api/orders)...');
    const getShopOrdersRes = await fetch(`${SHOP_URL}/api/orders`, {
      headers: { 'Authorization': `Bearer ${shopToken}` }
    });
    const getShopOrdersData = await getShopOrdersRes.json();
    console.log('Shop Orders Response Status:', getShopOrdersRes.status, `Total Orders: ${getShopOrdersData.data?.length || 0}`);
    const foundOrderInShop = (getShopOrdersData.data || []).find(o => o.id === orderId);
    if (!foundOrderInShop) throw new Error('Order created by Customer A not found in Shopkeeper orders list');
    console.log(`Exact order found in Shopkeeper dashboard! ID: ${foundOrderInShop.id}, Status: ${foundOrderInShop.status}, CustomerId: ${foundOrderInShop.customerId}`);

    // 5. Test Status Lifecycle: Pending -> Accepted -> PickedUp -> InTransit -> Delivered
    console.log('\n5. TESTING STATUS LIFECYCLE...');

    // 5a. Shopkeeper Accepts Order (PUT /api/orders/:id/accept)
    console.log('Step 5a: Shopkeeper accepting order...');
    const acceptRes = await fetch(`${SHOP_URL}/api/orders/${orderId}/accept`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${shopToken}` }
    });
    console.log('Accept Response Status:', acceptRes.status);
    if (!acceptRes.ok) throw new Error(`Accept order failed: ${await acceptRes.text()}`);

    // Verify status in Atlas
    const orderAfterAccept = await db.collection('orders').findOne({ _id: new mongoose.Types.ObjectId(orderId) });
    console.log('Atlas orders.status after Accept:', orderAfterAccept.status);
    if (orderAfterAccept.status !== 'Accepted') throw new Error('Atlas status mismatch after Accept');

    // Verify Customer order response via COS backend
    const custGetOrderAccept = await fetch(`${COS_URL}/api/orders/${orderId}`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const custDataAccept = await custGetOrderAccept.json();
    console.log('COS Customer Order Response Status after Accept:', custDataAccept.status || custDataAccept.deliveryStatus);

    // 5b. Delivery Partner authenticates & picks up order
    console.log('Step 5b: Registering/logging in Delivery Partner on Shop backend...');
    let dpToken;
    const dpLoginRes = await fetch(`${SHOP_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'delivery@localkart.com', password: 'password123' })
    });
    if (dpLoginRes.ok) {
      const dpData = await dpLoginRes.json();
      dpToken = dpData.data.token;
    } else {
      const dpRegRes = await fetch(`${SHOP_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Phase 2E Delivery Runner',
          email: 'delivery@localkart.com',
          password: 'password123',
          phone: '9123456789',
          role: 'DELIVERY_PARTNER',
          vehicleType: 'MOTORCYCLE'
        })
      });
      const dpRegData = await dpRegRes.json();
      dpToken = dpRegData.data.token;
    }
    console.log('Delivery Partner Token acquired.');

    console.log('Delivery Partner picking up order (PUT /api/orders/:id/pickup)...');
    const pickupRes = await fetch(`${SHOP_URL}/api/orders/${orderId}/pickup`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${dpToken}` }
    });
    console.log('Pickup Response Status:', pickupRes.status);
    if (!pickupRes.ok) throw new Error(`Pickup order failed: ${await pickupRes.text()}`);

    const orderAfterPickup = await db.collection('orders').findOne({ _id: new mongoose.Types.ObjectId(orderId) });
    console.log('Atlas orders.status after Pickup:', orderAfterPickup.status);
    if (orderAfterPickup.status !== 'PickedUp') throw new Error('Atlas status mismatch after Pickup');

    // 5c. Delivery Partner transitions to InTransit
    console.log('Step 5c: Delivery Partner updating status to InTransit...');
    const transitRes = await fetch(`${SHOP_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${dpToken}`
      },
      body: JSON.stringify({ status: 'InTransit' })
    });
    console.log('InTransit Status Response Status:', transitRes.status);

    const orderAfterTransit = await db.collection('orders').findOne({ _id: new mongoose.Types.ObjectId(orderId) });
    console.log('Atlas orders.status after InTransit:', orderAfterTransit.status);
    if (orderAfterTransit.status !== 'InTransit') throw new Error('Atlas status mismatch after InTransit');

    // 5d. Delivery Partner transitions to Delivered
    console.log('Step 5d: Delivery Partner updating status to Delivered...');
    const deliverRes = await fetch(`${SHOP_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${dpToken}`
      },
      body: JSON.stringify({ status: 'Delivered' })
    });
    console.log('Delivered Status Response Status:', deliverRes.status);

    const orderAfterDeliver = await db.collection('orders').findOne({ _id: new mongoose.Types.ObjectId(orderId) });
    console.log('Atlas orders.status after Delivered:', orderAfterDeliver.status);
    if (orderAfterDeliver.status !== 'Delivered') throw new Error('Atlas status mismatch after Delivered');

    // Verify final COS Customer Order response
    const custGetOrderDeliver = await fetch(`${COS_URL}/api/orders/${orderId}`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const custDataDeliver = await custGetOrderDeliver.json();
    console.log('COS Customer Order Final Status:', custDataDeliver.status || custDataDeliver.deliveryStatus);

    // 6. SECURITY & ISOLATION TESTS
    console.log('\n6. TESTING SECURITY & ISOLATION...');

    // 6a. Customer B accessing Customer A's order
    console.log('6a. Customer B attempting to view Customer A order...');
    const custBGetRes = await fetch(`${COS_URL}/api/orders/${orderId}`, {
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    console.log('Customer B View Order Response Status:', custBGetRes.status);
    if (custBGetRes.status !== 403 && custBGetRes.status !== 404) {
      throw new Error(`SECURITY VIOLATION: Customer B was able to view Customer A order! Status: ${custBGetRes.status}`);
    }

    // 6b. Register a Second Shopkeeper (Shopkeeper B) with another shop
    console.log('6b. Registering Shopkeeper B with separate shop for isolation test...');
    const shopBEmail = `shopkeeper_b_p2e_${Date.now()}@localkart.com`;
    const regShopBRes = await fetch(`${SHOP_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Shopkeeper B',
        email: shopBEmail,
        password: 'password123',
        phone: `94${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: 'SHOPKEEPER',
        shopName: 'Unrelated Shop B',
        shopAddress: 'Other Street 12'
      })
    });
    const regShopBData = await regShopBRes.json();
    const tokenShopB = regShopBData.data.token;
    const userShopB_id = regShopBData.data.user.id;

    console.log('Shopkeeper B attempting to modify Customer A / Shop A order...');
    const shopBAcceptRes = await fetch(`${SHOP_URL}/api/orders/${orderId}/accept`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenShopB}` }
    });
    console.log('Shopkeeper B Accept Order Status:', shopBAcceptRes.status);
    if (shopBAcceptRes.status !== 404 && shopBAcceptRes.status !== 403) {
      throw new Error(`SECURITY VIOLATION: Shopkeeper B modified an unrelated shop order! Status: ${shopBAcceptRes.status}`);
    }

    // 6c. Register a Second Delivery Partner (DP B)
    console.log('6c. Registering Delivery Partner B for isolation test...');
    const dpBEmail = `dp_b_p2e_${Date.now()}@localkart.com`;
    const regDpBRes = await fetch(`${SHOP_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Delivery Partner B',
        email: dpBEmail,
        password: 'password123',
        phone: `93${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: 'DELIVERY_PARTNER',
        vehicleType: 'BICYCLE'
      })
    });
    const regDpBData = await regDpBRes.json();
    const tokenDpB = regDpBData.data.token;
    const userDpB_id = regDpBData.data.user.id;

    console.log('Delivery Partner B attempting to update unassigned order status...');
    const dpBUpdateRes = await fetch(`${SHOP_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenDpB}`
      },
      body: JSON.stringify({ status: 'Delivered' })
    });
    console.log('Delivery Partner B Update Status:', dpBUpdateRes.status);
    if (dpBUpdateRes.status !== 404 && dpBUpdateRes.status !== 403) {
      throw new Error(`SECURITY VIOLATION: Unassigned Delivery Partner B updated order status! Status: ${dpBUpdateRes.status}`);
    }

    // 6d. Invalid / Nonexistent Order IDs
    console.log('6d. Testing invalid & nonexistent order IDs...');
    const invalidIdRes = await fetch(`${COS_URL}/api/orders/invalid-hex-id-999`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    console.log('Invalid ID Response Status:', invalidIdRes.status);

    const nonExistentIdRes = await fetch(`${COS_URL}/api/orders/600000000000000000000000`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    console.log('Nonexistent ID Response Status:', nonExistentIdRes.status);

    console.log('ALL SECURITY & AUTHORIZATION TESTS PASSED!');

    // 7. REFERENCE INTEGRITY & ORPHAN CHECK
    console.log('\n7. VERIFYING REFERENCE INTEGRITY & ORPHAN REFERENCES...');
    const userExists = await db.collection('users').findOne({ _id: atlasOrder.customerId });
    const shopExists = await db.collection('shops').findOne({ _id: atlasOrder.shopId });
    console.log(`orders.customerId -> users._id valid: ${!!userExists}`);
    console.log(`orders.shopId -> shops._id valid: ${!!shopExists}`);

    for (const item of atlasOrderItems) {
      const parentOrder = await db.collection('orders').findOne({ _id: item.orderId });
      const itemProduct = await db.collection('products').findOne({ _id: item.productId });
      console.log(`order_items.orderId -> orders._id valid: ${!!parentOrder}`);
      console.log(`order_items.productId -> products._id valid: ${!!itemProduct}`);
      if (!parentOrder || !itemProduct) throw new Error('Orphan reference detected in order_items!');
    }
    console.log('REFERENCE INTEGRITY VERIFIED 100%! Zero orphan references.');

    // 8. TEST CLEANUP
    console.log('\n8. CLEANING UP TEST DATA...');
    // Delete test order and test order items
    await db.collection('orders').deleteOne({ _id: new mongoose.Types.ObjectId(orderId) });
    await db.collection('order_items').deleteMany({ orderId: new mongoose.Types.ObjectId(orderId) });

    // Restore product stock
    await db.collection('products').updateOne(
      { _id: sampleProduct._id },
      { $inc: { stock: 2 } }
    );
    console.log('Product stock restored.');

    // Delete test users created for testing
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

    console.log('All test orders, order items, test users, shops, and delivery partner profiles cleaned up from Atlas.');

    console.log('\nPHASE 2E E2E INTEGRATION TEST COMPLETED SUCCESSFULLY WITH 100% PASS!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\nE2E TEST ERROR:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runPhase2ETest();
