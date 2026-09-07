import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function inspectCartAndAddress() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const db = mongoose.connection.db;

    // List all collections in Atlas DB
    const collections = await db.listCollections().toArray();
    console.log('\n--- ATLAS DB COLLECTIONS LIST ---');
    collections.forEach(c => console.log(` - ${c.name}`));

    // Check carts collection
    const cartsColl = db.collection('carts');
    const cartCount = await cartsColl.countDocuments();
    console.log(`\n'carts' collection count: ${cartCount}`);
    if (cartCount > 0) {
      const sampleCarts = await cartsColl.find({}).limit(3).toArray();
      console.log('Sample carts:', JSON.stringify(sampleCarts, null, 2));
    }

    // Check addresses collection (if exists)
    const addressesColl = db.collection('addresses');
    const addressCount = await addressesColl.countDocuments();
    console.log(`\n'addresses' collection count: ${addressCount}`);
    if (addressCount > 0) {
      const sampleAddresses = await addressesColl.find({}).limit(3).toArray();
      console.log('Sample addresses:', JSON.stringify(sampleAddresses, null, 2));
    }

    // Check users collection for embedded addresses
    const usersColl = db.collection('users');
    const usersWithAddresses = await usersColl.find({ addresses: { $exists: true, $not: { $size: 0 } } }).toArray();
    console.log(`\nUsers with embedded addresses: ${usersWithAddresses.length}`);
    if (usersWithAddresses.length > 0) {
      usersWithAddresses.forEach(u => {
        console.log(`User ${u._id} (${u.name}) has ${u.addresses.length} embedded addresses:`, u.addresses);
      });
    }

    await mongoose.disconnect();
    console.log('\nDone.');
  } catch (err) {
    console.error('Inspection error:', err);
    process.exit(1);
  }
}

inspectCartAndAddress();
