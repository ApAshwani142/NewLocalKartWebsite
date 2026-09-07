import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import storeRoutes from './routes/stores.js';
import orderRoutes from './routes/orders.js';
import cartRoutes from './routes/cart.js';
import addressRoutes from './routes/addresses.js';
import notificationRoutes from './routes/notifications.js';
import contactRoutes from './routes/contact.js';
import chatbotRoutes from './routes/chatbot.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:5173'
    ];

const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const isAllowedConfigured = allowedOrigins.includes(origin);
    const isDevLocalhost = !isProduction && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'));

    if (isAllowedConfigured || isDevLocalhost) {
      return callback(null, true);
    }

    if (isProduction) {
      return callback(new Error('CORS blocked: Origin not allowed in production'), false);
    }

    return callback(null, true);
  },
  credentials: true
};

// Enable CORS
app.use(cors(corsOptions));

// Body parser
app.use(express.json());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.send('e-LocalKart API is running...');
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
