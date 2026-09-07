import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import User from './models/User.js';
import Product from './models/Product.js';
import Store from './models/Store.js';
import Order from './models/Order.js';
import Cart from './models/Cart.js';
import Notification from './models/Notification.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import storeRoutes from './routes/stores.js';
import orderRoutes from './routes/orders.js';
import cartRoutes from './routes/cart.js';
import addressRoutes from './routes/addresses.js';
import notificationRoutes from './routes/notifications.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/notifications', notificationRoutes);

async function runE2ETests() {
  console.log('====================================================');
  console.log('STARTING E2E INTEGRATION & ARCHITECTURE TESTS');
  console.log('====================================================\n');

  // Connect to MongoDB
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/localkart';
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB:', mongoUri);
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.log('Make sure MongoDB service is running locally on port 27017!');
    process.exit(1);
  }

  const server = app.listen(5099, async () => {
    const baseUrl = 'http://localhost:5099/api';
    let customerToken = '';
    let shopkeeperToken = '';
    let createdProductId = '';
    let placedOrderId = '';

    try {
      // 1. Clean test collections
      await User.deleteMany({ email: { $in: ['testcustomer@example.com', 'testshopkeeper@example.com'] } });
      await Product.deleteMany({ name: 'Fresh Organic Mangoes' });

      // 2. Test Customer Registration & Login
      console.log('\n--- 1. Testing Customer Auth ---');
      const custRegRes = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Customer',
          email: 'testcustomer@example.com',
          phone: '9998887771',
          password: 'password123',
          otp: '123456',
          role: 'customer'
        })
      });
      const custRegData = await custRegRes.json();
      if (!custRegRes.ok) throw new Error(`Customer reg failed: ${custRegData.message}`);
      customerToken = custRegData.token;
      console.log('✅ Customer Registration Successful (Role:', custRegData.role, ')');

      // 3. Test Shopkeeper Registration & Login
      console.log('\n--- 2. Testing Shopkeeper Auth ---');
      const shopRegRes = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Shopkeeper',
          email: 'testshopkeeper@example.com',
          phone: '9998887772',
          password: 'password123',
          otp: '123456',
          role: 'shopkeeper'
        })
      });
      const shopRegData = await shopRegRes.json();
      if (!shopRegRes.ok) throw new Error(`Shopkeeper reg failed: ${shopRegData.message}`);
      shopkeeperToken = shopRegData.token;
      console.log('✅ Shopkeeper Registration Successful (Role:', shopRegData.role, ')');

      // 4. Test FCM Token Registration
      console.log('\n--- 3. Testing FCM Token Readiness ---');
      const fcmRes = await fetch(`${baseUrl}/auth/fcm-token`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`
        },
        body: JSON.stringify({ fcmToken: 'sample_fcm_token_device_abc123' })
      });
      const fcmData = await fcmRes.json();
      if (!fcmRes.ok) throw new Error(`FCM update failed: ${fcmData.message}`);
      console.log('✅ FCM Token Saved:', fcmData.fcmToken);

      // 5. Test Shopkeeper Product Creation
      console.log('\n--- 4. Testing Product Creation by Shopkeeper ---');
      const prodCreateRes = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${shopkeeperToken}`
        },
        body: JSON.stringify({
          name: 'Fresh Organic Mangoes',
          category: 'Fruits',
          price: 120,
          originalPrice: 150,
          discount: 20,
          image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400',
          unit: '1 kg',
          stock: 50,
          description: 'Delicious sweet Alphonso mangoes fresh from farm.',
          storeName: 'Test Shopkeeper Kirana'
        })
      });
      const prodCreateData = await prodCreateRes.json();
      if (!prodCreateRes.ok) throw new Error(`Product creation failed: ${prodCreateData.message}`);
      createdProductId = prodCreateData._id;
      console.log('✅ Product Created by Shopkeeper ID:', createdProductId, 'Name:', prodCreateData.name);

      // 6. Test Public Product Retrieval (Customer view)
      console.log('\n--- 5. Testing Public Product Fetching for Customer ---');
      const pubProdRes = await fetch(`${baseUrl}/products`);
      const pubProdData = await pubProdRes.json();
      const foundInPublic = pubProdData.some(p => p._id === createdProductId);
      if (!foundInPublic) throw new Error('Product added by shopkeeper did not immediately appear in public customer catalog!');
      console.log('✅ Customer Product Feed verified! Shopkeeper product is immediately live.');

      // 7. Test Cart Management API
      console.log('\n--- 6. Testing Persistent Cart APIs ---');
      const cartRes = await fetch(`${baseUrl}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`
        },
        body: JSON.stringify({ productId: createdProductId, quantity: 2 })
      });
      const cartData = await cartRes.json();
      if (!cartRes.ok) throw new Error(`Cart add failed: ${cartData.message}`);
      console.log('✅ Added to Cart. Items in cart:', cartData.items.length);

      // 8. Test Address API
      console.log('\n--- 7. Testing User Address APIs ---');
      const addrRes = await fetch(`${baseUrl}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`
        },
        body: JSON.stringify({
          label: 'Home',
          street: '123 Station Road',
          city: 'Ara',
          pincode: '802301',
          isDefault: true
        })
      });
      const addrData = await addrRes.json();
      if (!addrRes.ok) throw new Error(`Address add failed: ${addrData.message}`);
      console.log('✅ Address Added. Total addresses:', addrData.length);

      // 9. Test Customer Order Placement
      console.log('\n--- 8. Testing Customer Order Placement ---');
      const orderRes = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`
        },
        body: JSON.stringify({
          orderItems: [
            {
              name: 'Fresh Organic Mangoes',
              qty: 2,
              image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400',
              price: 120,
              product: createdProductId
            }
          ],
          deliveryAddress: '123 Station Road, Ara (802301)',
          paymentMethod: 'COD',
          subtotal: 240,
          deliveryFee: 15,
          tax: 5,
          totalPrice: 260
        })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(`Order placement failed: ${orderData.message}`);
      placedOrderId = orderData.order._id;
      console.log('✅ Customer Order Placed Successfully! Order ID:', placedOrderId);

      // 10. Test Shopkeeper Dashboard Order Feed & Status Update
      console.log('\n--- 9. Testing Shopkeeper Order Synchronization ---');
      const shopOrdersRes = await fetch(`${baseUrl}/orders/store-orders`, {
        headers: { Authorization: `Bearer ${shopkeeperToken}` }
      });
      const shopOrdersData = await shopOrdersRes.json();
      const foundOrder = shopOrdersData.find(o => o._id === placedOrderId);
      if (!foundOrder) throw new Error('Customer order did not appear in Shopkeeper Store Orders feed!');
      console.log('✅ Customer Order automatically appeared in Shopkeeper Feed!');

      // Update Order Status
      const statusRes = await fetch(`${baseUrl}/orders/${placedOrderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${shopkeeperToken}`
        },
        body: JSON.stringify({ status: 'Out for Delivery' })
      });
      const statusData = await statusRes.json();
      if (!statusRes.ok) throw new Error(`Status update failed: ${statusData.message}`);
      console.log('✅ Shopkeeper updated order status to:', statusData.deliveryStatus);

      console.log('\n====================================================');
      console.log('🎉 ALL ARCHITECTURE & REFACTORING TESTS PASSED 100%!');
      console.log('====================================================\n');
    } catch (err) {
      console.error('\n❌ TEST FAILED:', err.message);
    } finally {
      server.close();
      await mongoose.connection.close();
      process.exit(0);
    }
  });
}

runE2ETests();
