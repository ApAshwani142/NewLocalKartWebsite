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
app.disable('x-powered-by');

const defaultAllowedOrigins = [
  'https://new-local-kart-website.vercel.app',
  'https://local-kart-shop-agent-4vgq-six.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  'http://localhost:5001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:5001',
  'http://127.0.0.1:5173'
];

const envOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim().replace(/\/+$/, '')).filter(Boolean)
  : [];

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envOrigins]));

const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server, mobile, curl, or Next.js internal rewrites
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.trim().replace(/\/+$/, '');

    // Allow configured origins
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // Allow any Vercel production or preview deployment
    if (cleanOrigin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Allow localhost in non-production
    if (!isProduction && (cleanOrigin.startsWith('http://localhost:') || cleanOrigin.startsWith('http://127.0.0.1:'))) {
      return callback(null, true);
    }

    console.warn(`[CORS Warning] Blocked request from origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
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

// Active promotions endpoint (prevents 404 in DealOfTheDay component)
app.get('/api/promotions/active', (req, res) => {
  res.json({
    isActive: false,
    title: 'Mega Grocery Sale Live Now!',
    discountText: 'Special discounts on daily essentials!',
    badge: 'Deal of the Day',
    expiresInSeconds: 86400
  });
});

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
