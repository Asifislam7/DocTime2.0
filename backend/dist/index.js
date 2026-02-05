"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const appointment_routes_1 = __importDefault(require("./routes/appointment.routes"));
const chatbot_routes_1 = __importDefault(require("./routes/chatbot.routes"));
const prescription_routes_1 = __importDefault(require("./routes/prescription.routes"));
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Connect to MongoDB
(0, database_1.connectDB)();
// CORS middleware - handle cross-origin requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
});
// Middleware
app.use((0, morgan_1.default)('combined')); // Logging
app.use(express_1.default.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'DocTime Backend is running',
        timestamp: new Date().toISOString(),
        environment: process.env['NODE_ENV'] || 'development'
    });
});
// API routes
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/appointments', appointment_routes_1.default);
app.use('/api/v1/chatbot', chatbot_routes_1.default);
app.use('/api/v1/prescriptions', prescription_routes_1.default);
// Default API response
app.get('/api/v1', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'DocTime API v1',
        endpoints: {
            users: '/api/v1/users',
            appointments: '/api/v1/appointments',
            prescriptions: '/api/v1/prescriptions',
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
    console.log(`🌐 CORS enabled for: http://localhost:3000`);
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
//# sourceMappingURL=index.js.map