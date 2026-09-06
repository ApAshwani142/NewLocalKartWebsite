const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function inspectPhase2E() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const db = mongoose.connection.db;

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n--- COLLECTIONS IN ATLAS ---');
    collections.forEach(c => console.log(` - ${c.name}`));

    // Inspect orders
    const ordersCount = await db.collection('orders').countDocuments();
    console.log(`\n'orders' collection document count: ${ordersCount}`);
    if (ordersCount > 0) {
      const sampleOrder = await db.collection('orders').findOne({});
      console.log('Sample Order document:', JSON.stringify(sampleOrder, null, 2));
    }

    // Inspect order_items
    const itemsCount = await db.collection('order_items').countDocuments();
    console.log(`'order_items' collection document count: ${itemsCount}`);
    if (itemsCount > 0) {
      const sampleItem = await db.collection('order_items').findOne({});
      console.log('Sample OrderItem document:', JSON.stringify(sampleItem, null, 2));
    }

    // Inspect users
    const usersCount = await db.collection('users').countDocuments();
    console.log(`'users' collection document count: ${usersCount}`);

    // Inspect products
    const productsCount = await db.collection('products').countDocuments();
    console.log(`'products' collection document count: ${productsCount}`);
    const sampleProduct = await db.collection('products').findOne({});
    if (sampleProduct) {
      console.log('Sample Product document fields:', Object.keys(sampleProduct));
      console.log(`Sample Product ID: ${sampleProduct._id}, ShopId: ${sampleProduct.shopId || sampleProduct.shop}`);
    }

    // Inspect shops
    const shopsCount = await db.collection('shops').countDocuments();
    console.log(`'shops' collection document count: ${shopsCount}`);
    const sampleShop = await db.collection('shops').findOne({});
    if (sampleShop) {
      console.log(`Sample Shop ID: ${sampleShop._id}, userId: ${sampleShop.userId}, name: ${sampleShop.name}`);
    }

    // Inspect delivery_partners
    const dpsCount = await db.collection('delivery_partners').countDocuments();
    console.log(`'delivery_partners' collection document count: ${dpsCount}`);

    await mongoose.disconnect();
    console.log('\nDone.');
  } catch (err) {
    console.error('Inspection error:', err);
    process.exit(1);
  }
}

inspectPhase2E();
