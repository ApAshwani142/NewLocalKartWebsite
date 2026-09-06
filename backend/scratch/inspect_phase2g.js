const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function inspectPhase2G() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const db = mongoose.connection.db;

    // 1. Inspect User documents in Atlas
    const users = await db.collection('users').find({}).toArray();
    console.log(`\n--- USERS COLLECTION AUDIT (${users.length} users) ---`);
    users.forEach((u, i) => {
      const hasPassword = !!u.password;
      const isBcrypt = hasPassword && typeof u.password === 'string' && u.password.startsWith('$2');
      console.log(`[${i+1}] ID: ${u._id} | Email: ${u.email} | Role: ${u.role} | Password Hashed: ${isBcrypt}`);
    });

    // 2. Check for any users with plain text passwords or missing fields
    const invalidUsers = users.filter(u => !u.password || !u.password.startsWith('$2'));
    if (invalidUsers.length > 0) {
      console.warn('WARNING: Users with invalid password hashes found:', invalidUsers.map(u => u.email));
    } else {
      console.log('ALL passwords in Atlas are valid bcrypt hashes.');
    }

    await mongoose.disconnect();
    console.log('\nDone.');
  } catch (err) {
    console.error('Inspection error:', err);
    process.exit(1);
  }
}

inspectPhase2G();
