const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Store = require('./models/Store');

dotenv.config();

async function seedDemoAccounts() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/localkart';

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB:', mongoUri);

    // 1. Create/Find a Demo Store for Shopkeeper
    let store = await Store.findOne({ name: 'Bhojpur Supermart' });
    if (!store) {
      store = await Store.create({
        name: 'Bhojpur Supermart',
        tagline: 'Hyperlocal Fresh Express & Daily Needs',
        address: 'Station Road, Near Railway Colony',
        city: 'Ara',
        area: 'Station Road',
        pincode: '802301',
        lat: 25.556,
        lng: 84.664,
        rating: 4.9,
        numRatings: 180,
        isOpen: true,
        phone: '+919800000001',
        categories: ['Groceries', 'Fruits & Veggies', 'Dairy']
      });
      console.log('✅ Created Demo Store:', store.name);
    }

    // 2. Demo Accounts Data
    const accounts = [
      {
        name: 'Bhojpur Supermart (Shopkeeper)',
        email: 'shopkeeper@localkart.com',
        phone: '9800000001',
        password: 'password123',
        role: 'shopkeeper',
        store: store._id
      },
      {
        name: 'Rahul Kumar (Delivery Agent)',
        email: 'rider@localkart.com',
        phone: '9800000002',
        password: 'password123',
        role: 'delivery_agent'
      },
      {
        name: 'LocalKart Administrator',
        email: 'admin@localkart.com',
        phone: '9800000003',
        password: 'password123',
        role: 'admin'
      },
      {
        name: 'Priya Sharma (Customer)',
        email: 'customer@localkart.com',
        phone: '9800000000',
        password: 'password123',
        role: 'customer'
      }
    ];

    for (const acc of accounts) {
      let user = await User.findOne({
        $or: [{ email: acc.email }, { phone: acc.phone }]
      });

      if (!user) {
        user = await User.create(acc);
        console.log(`✅ Created ${acc.role.toUpperCase()} Account:`);
      } else {
        user.role = acc.role;
        user.name = acc.name;
        user.password = acc.password; // Will trigger pre-save bcrypt hash
        if (acc.store) user.store = acc.store;
        await user.save();
        console.log(`✅ Updated ${acc.role.toUpperCase()} Account:`);
      }

      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Phone: ${user.phone}`);
      console.log(`   Password: password123`);
      console.log(`   Role: ${user.role}\n`);
    }

    console.log('===========================================================');
    console.log('🎉 ALL DEMO ACCOUNTS SEEDED SUCCESSFULLY!');
    console.log('===========================================================');

  } catch (err) {
    console.error('❌ Error seeding demo accounts:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedDemoAccounts();
