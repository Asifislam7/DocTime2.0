import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { connectDB } from './config/database';
import userRoutes from './routes/user.routes';
import appointmentRoutes from './routes/appointment.routes';
import chatbotRoutes from './routes/chatbot.routes';
import prescriptionRoutes from './routes/prescription.routes';

const app = express();

const DEV_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:3003',
];
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed =
    (origin && DEV_ORIGINS.includes(origin)) ||
    (FRONTEND_URL && origin === FRONTEND_URL);

  if (allowed && origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
});

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'DocTime Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env['NODE_ENV'] || 'development',
  });
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/chatbot', chatbotRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);

app.get('/api/v1', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'DocTime API v1',
    endpoints: {
      users: '/api/v1/users',
      appointments: '/api/v1/appointments',
      prescriptions: '/api/v1/prescriptions',
      health: '/health',
    },
  });
});

const PORT = Number(process.env['PORT']) || 3001;
const NODE_ENV = process.env['NODE_ENV'] || 'development';

async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 DocTime Backend running on port ${PORT}`);
    console.log(`📊 Environment: ${NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(
      `🌐 CORS enabled for: ${FRONTEND_URL || 'localhost:3000/3002/3003'}`
    );
  });
}

start().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});
