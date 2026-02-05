"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/doctime';
const connectDB = async () => {
    try {
        // Connection options for better performance and reliability
        const options = {
            maxPoolSize: 10, // Maximum number of connections in the pool
            serverSelectionTimeoutMS: 5000, // Timeout for server selection
            socketTimeoutMS: 45000, // Timeout for socket operations
        };
        await mongoose_1.default.connect(MONGODB_URI, options);
        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${mongoose_1.default.connection.name}`);
        console.log(`🔗 URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
        // Connection event listeners
        mongoose_1.default.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });
        mongoose_1.default.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });
        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose_1.default.connection.close();
            console.log('📴 MongoDB connection closed through app termination');
            process.exit(0);
        });
    }
    catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// Export connection for use in other parts of the app
const getConnection = () => mongoose_1.default.connection;
exports.getConnection = getConnection;
//# sourceMappingURL=database.js.map