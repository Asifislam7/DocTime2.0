import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env['PORT'] || 5000;

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env['NODE_ENV'] === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env['NODE_ENV'] === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'DocTime API is running',
    timestamp: new Date().toISOString(),
    environment: process.env['NODE_ENV']
  });
});

// API Routes (we'll add these next)
app.use('/api/v1', (_req, res) => {
  res.json({ message: 'API routes coming soon!' });
});

// Error handling middleware (we'll add these later)
// app.use(notFound);
// app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DocTime Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env['NODE_ENV']}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
