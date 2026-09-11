import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import path from 'path';
import fs from 'fs';
import routes from './routes';

dotenv.config();

// Ensure SRV DNS lookup succeeds on Windows/local networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore fallback if restricted
}

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://anthurium.in',
  'https://www.anthurium.in',
  'https://admin.anthurium.in',
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
  ...(process.env.ADMIN_URL ? [process.env.ADMIN_URL] : []),
  ...(process.env.STOREFRONT_URL ? [process.env.STOREFRONT_URL] : [])
];

// Security and Parser Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Base API Routes
app.use('/api', routes);

// Serve static uploaded files
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    store: 'ANTHURIUM Boutique Engine',
    time: new Date().toISOString()
  });
});

// Database Connection & Server Launch
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anthurium';

const startServer = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully.');
  } catch (err: any) {
    console.warn('⚠️ MongoDB connection warning:', err.message);
    console.warn('Running server in memory/development fallback mode.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 ANTHURIUM Backend API listening on http://localhost:${PORT}`);
  });
};

startServer();
