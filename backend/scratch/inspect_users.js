const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function inspectUsers() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing in .env');
      process.exit(1);
    }
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected!');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    const totalUsers = await usersCollection.countDocuments();
    console.log(`Total users in 'users' collection: ${totalUsers}`);

    const users = await usersCollection.find({}).toArray();
    console.log('\n--- ALL USERS SUMMARY ---');
    users.forEach((u, i) => {
      console.log(`[${i+1}] ID: ${u._id}`);
      console.log(`    Name: ${u.name}`);
      console.log(`    Email: ${u.email}`);
      console.log(`    Phone: ${u.phone}`);
      console.log(`    Role: ${u.role}`);
      console.log(`    Password Hashed (bcrypt?): ${typeof u.password === 'string' && u.password.startsWith('$2')}`);
      console.log(`    firebaseUid: ${u.firebaseUid || 'N/A'}`);
      console.log(`    supabaseUid: ${u.supabaseUid || 'N/A'}`);
      console.log(`    createdAt: ${u.createdAt}`);
    });

    // Check role distribution
    const rolesPipeline = [
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ];
    const roleCounts = await usersCollection.aggregate(rolesPipeline).toArray();
    console.log('\n--- ROLE DISTRIBUTION ---');
    console.log(roleCounts);

    // Check relations: Shop.userId and DeliveryPartner.userId
    const shopsCollection = db.collection('shops');
    const shops = await shopsCollection.find({}).toArray();
    console.log('\n--- SHOPS USER ID VERIFICATION ---');
    for (const shop of shops) {
      const userExists = await usersCollection.findOne({ _id: shop.userId });
      console.log(`Shop '${shop.name}' (userId: ${shop.userId}) -> Linked User Exists: ${!!userExists} (${userExists ? userExists.name + ' [' + userExists.role + ']' : 'NOT FOUND'})`);
    }

    const dpCollection = db.collection('delivery_partners');
    const dps = await dpCollection.find({}).toArray();
    console.log('\n--- DELIVERY PARTNERS USER ID VERIFICATION ---');
    for (const dp of dps) {
      const userExists = await usersCollection.findOne({ _id: dp.userId });
      console.log(`DP ID '${dp._id}' (userId: ${dp.userId}) -> Linked User Exists: ${!!userExists} (${userExists ? userExists.name + ' [' + userExists.role + ']' : 'NOT FOUND'})`);
    }

    await mongoose.disconnect();
    console.log('\nDone.');
  } catch (err) {
    console.error('Error during user inspection:', err);
    process.exit(1);
  }
}

inspectUsers();
