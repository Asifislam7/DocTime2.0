import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import userRoutes from './routes/user.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// SUPER SIMPLE CORS - handle everything
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  console.log(`📝 Headers:`, req.headers);
  
  // Set CORS headers for ALL requests
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('🔄 OPTIONS preflight - sending 200');
    res.status(200).end();
    return;
  }
  
  next();
});

// Middleware
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🏥 Health check endpoint hit');
  try {
    res.status(200).json({
      success: true,
      message: 'DocTime Backend is running',
      timestamp: new Date().toISOString(),
      environment: process.env['NODE_ENV'] || 'development'
    });
  } catch (error) {
    console.error('❌ Error in health endpoint:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Simple test endpoint
app.get('/test', (req, res) => {
  console.log('🧪 Test endpoint hit');
  res.status(200).send('Backend is working!');
});

// API routes
app.use('/api/v1/users', userRoutes);

// Default API response
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DocTime API v1',
    endpoints: {
      users: '/api/v1/users',
      health: '/health'
    }
  });
});

// Start server
const PORT = process.env['PORT'] || 3001;
const NODE_ENV = process.env['NODE_ENV'] || 'development';

app.listen(PORT, () => {
  console.log(`🚀 DocTime Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 CORS: Explicit headers for localhost:3000`);
  console.log(`🔍 Debug mode: All requests will be logged`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});
