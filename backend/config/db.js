import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.DATABASE_URL;
    if (!mongoUri) {
      throw new Error('Database URI is not defined (checked MONGO_URI, MONGODB_URI, MONGODB_URL, DATABASE_URL).');
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}, Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
