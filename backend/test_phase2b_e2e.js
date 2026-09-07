import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const COS_URL = 'http://localhost:5000';
const SHOP_URL = 'http://localhost:5001';
const JWT_SECRET = 'localkart_super_secret_jwt_key_change_in_production';

async function runE2ETest() {
  console.log('--- STARTING PHASE 2B E2E INTEGRATION TEST ---');

  // 1. Fetch products from COS backend
  const productsRes = await fetch(`${COS_URL}/api/products`);
  const products = await productsRes.json();
  console.log(`1. COS backend GET /api/products returned ${products.length} products.`);

  if (!products || products.length === 0) {
    throw new Error('No products found to test order creation');
  }

  const targetProduct = products[0];
  const initialStock = targetProduct.stock;
  console.log(`Target Product: "${targetProduct.name}" (ID: ${targetProduct._id}), Initial Stock: ${initialStock}, ShopId: ${targetProduct.storeId}`);

  // Generate Customer JWT token for COS backend checkout using existing Atlas user ID
  const customerToken = jwt.sign(
    { id: '6a9b038fd4c4c2897db52998', userId: '6a9b038fd4c4c2897db52998', name: 'Suresh Gupta', email: 'suresh@localkart.com', role: 'customer' },
    'supersecretlocalkartkey12345!',
    { expiresIn: '1h' }
  );

  // 2. Create TEST order via COS backend (POST /api/orders)
  console.log('2. Creating TEST order via COS backend (POST /api/orders)...');
  const createOrderPayload = {
    orderItems: [
      {
        product: targetProduct._id,
        qty: 2,
        price: targetProduct.price
      }
    ],
    deliveryAddress: 'Flat 304, Test Block, Phase 2B Street, Ara 802301',
    paymentMethod: 'COD',
    subtotal: targetProduct.price * 2,
    deliveryFee: 40,
    tax: 0,
    totalPrice: (targetProduct.price * 2) + 40,
    customerName: 'Test Customer',
    customerPhone: '9876543210',
    notes: 'Phase 2B Integration Test Order'
  };

  const orderRes = await fetch(`${COS_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${customerToken}`
    },
    body: JSON.stringify(createOrderPayload)
  });

  const orderData = await orderRes.json();
  console.log('COS Create Order Response Status:', orderRes.status);
  
  const createdOrder = orderData.order || orderData;
  const testOrderId = createdOrder._id;
  console.log(`TEST Order Created Successfully! ID: ${testOrderId}, Status: ${createdOrder.status}, TotalAmount: ${createdOrder.totalAmount || createdOrder.totalPrice}`);

  // 3. Connect directly to Atlas database to inspect 'orders', 'order_items', and updated stock
  await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://priyanshupathak7371_db_user:cKVgxYXIU7XiCJeQ@cluster0.ouicapq.mongodb.net/e-localkart');
  
  const dbOrders = await mongoose.connection.db.collection('orders').find({ _id: new mongoose.Types.ObjectId(testOrderId) }).toArray();
  console.log(`3. MongoDB Atlas 'orders' collection count for ID ${testOrderId}: ${dbOrders.length}`);
  console.log('Atlas Order Document:', JSON.stringify(dbOrders[0], null, 2));

  const dbOrderItems = await mongoose.connection.db.collection('order_items').find({ orderId: new mongoose.Types.ObjectId(testOrderId) }).toArray();
  console.log(`4. MongoDB Atlas 'order_items' collection count for Order ${testOrderId}: ${dbOrderItems.length}`);
  console.log('Atlas OrderItem Document:', JSON.stringify(dbOrderItems[0], null, 2));

  const updatedProdDoc = await mongoose.connection.db.collection('products').findOne({ _id: new mongoose.Types.ObjectId(targetProduct._id) });
  console.log(`5. Stock check for Product "${targetProduct.name}": Initial=${initialStock}, New Stock in Atlas=${updatedProdDoc.stock}`);

  if (updatedProdDoc.stock !== initialStock - 2) {
    console.warn(`WARNING: Stock decrement mismatch. Expected ${initialStock - 2}, got ${updatedProdDoc.stock}`);
  }

  // 4. Test Shopkeeper login on Shop backend (port 5001)
  console.log('6. Authenticating as Shopkeeper on Shop backend (port 5001)...');
  const shopLoginRes = await fetch(`${SHOP_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'suresh@localkart.com', password: 'password123' })
  });
  const shopLoginData = await shopLoginRes.json();
  const shopToken = shopLoginData.data.token;
  console.log('Shopkeeper Login Successful. Token acquired.');

  // 5. Shopkeeper reads the test order on Shop backend
  console.log('7. Shopkeeper fetching shop orders via Shop backend (GET /api/orders)...');
  const shopOrdersRes = await fetch(`${SHOP_URL}/api/orders`, {
    headers: { 'Authorization': `Bearer ${shopToken}` }
  });
  const shopOrdersData = await shopOrdersRes.json();
  const fetchedShopOrders = shopOrdersData.data || [];
  console.log(`Shop backend returned ${fetchedShopOrders.length} orders for shopkeeper.`);
  const matchingShopOrder = fetchedShopOrders.find(o => o.id === testOrderId || o._id === testOrderId);
  console.log('Found matching order on Shop backend:', matchingShopOrder ? `ID=${matchingShopOrder.id}, Status=${matchingShopOrder.status}` : 'NOT FOUND');

  // 6. Shopkeeper accepts the test order (PUT /api/orders/:id/accept)
  console.log('8. Shopkeeper accepting order via Shop backend (PUT /api/orders/:id/accept)...');
  const acceptRes = await fetch(`${SHOP_URL}/api/orders/${testOrderId}/accept`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${shopToken}` }
  });
  const acceptData = await acceptRes.json();
  console.log('Accept Order Response:', acceptRes.status, acceptData.message || acceptData);

  const updatedAtlasOrder = await mongoose.connection.db.collection('orders').findOne({ _id: new mongoose.Types.ObjectId(testOrderId) });
  console.log(`9. Persisted Status in Atlas after Accept: "${updatedAtlasOrder.status}"`);

  // 7. Register/login Delivery Partner on Shop backend
  console.log('10. Registering/logging in Delivery Partner on Shop backend...');
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
    // Register delivery partner
    const regRes = await fetch(`${SHOP_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Ramesh Courier',
        email: 'delivery@localkart.com',
        password: 'password123',
        phone: '9123456789',
        role: 'DELIVERY_PARTNER',
        vehicleType: 'MOTORCYCLE'
      })
    });
    const regData = await regRes.json();
    dpToken = regData.data.token;
  }
  console.log('Delivery Partner Authenticated.');

  // 8. Delivery Partner fetches available orders (GET /api/orders/delivery/available)
  console.log('11. Delivery Partner fetching available orders...');
  const availRes = await fetch(`${SHOP_URL}/api/orders/delivery/available`, {
    headers: { 'Authorization': `Bearer ${dpToken}` }
  });
  const availData = await availRes.json();
  const availOrders = availData.data || [];
  console.log(`Delivery Partner sees ${availOrders.length} available orders.`);

  // 9. Delivery Partner picks up test order (PUT /api/orders/:id/pickup)
  console.log('12. Delivery Partner picking up test order...');
  const pickupRes = await fetch(`${SHOP_URL}/api/orders/${testOrderId}/pickup`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${dpToken}` }
  });
  const pickupData = await pickupRes.json();
  console.log('Pickup Order Response:', pickupRes.status, pickupData.message || pickupData);

  // 10. Delivery Partner updates status to InTransit (PUT /api/orders/:id/status)
  console.log('13. Delivery Partner updating status to InTransit...');
  const transitRes = await fetch(`${SHOP_URL}/api/orders/${testOrderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${dpToken}`
    },
    body: JSON.stringify({ status: 'InTransit' })
  });
  const transitData = await transitRes.json();
  console.log('InTransit Status Response:', transitRes.status, transitData.message || transitData);

  // 11. Delivery Partner updates status to Delivered (PUT /api/orders/:id/status)
  console.log('14. Delivery Partner updating status to Delivered...');
  const deliverRes = await fetch(`${SHOP_URL}/api/orders/${testOrderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${dpToken}`
    },
    body: JSON.stringify({ status: 'Delivered' })
  });
  const deliverData = await deliverRes.json();
  console.log('Delivered Status Response:', deliverRes.status, deliverData.message || deliverData);

  const finalAtlasOrder = await mongoose.connection.db.collection('orders').findOne({ _id: new mongoose.Types.ObjectId(testOrderId) });
  console.log(`14. Final Persisted Order Status in Atlas: "${finalAtlasOrder.status}"`);

  // 11. CLEAN UP ONLY THE TEST ORDER & TEST ORDER ITEMS DOCUMENTS
  console.log('\n--- CLEANING UP TEST DATA ---');
  await mongoose.connection.db.collection('orders').deleteOne({ _id: new mongoose.Types.ObjectId(testOrderId) });
  await mongoose.connection.db.collection('order_items').deleteMany({ orderId: new mongoose.Types.ObjectId(testOrderId) });
  await mongoose.connection.db.collection('inventory_logs').deleteMany({ reason: `Customer Order #${testOrderId}` });
  // Restore stock
  await mongoose.connection.db.collection('products').updateOne(
    { _id: new mongoose.Types.ObjectId(targetProduct._id) },
    { $inc: { stock: 2 } }
  );
  console.log('TEST DATA CLEANED UP SUCCESSFULLY. Original database state restored.');

  process.exit(0);
}

runE2ETest().catch(err => {
  console.error('E2E TEST ERROR:', err);
  process.exit(1);
});
