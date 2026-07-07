import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const MONGODB_URI = process.env['MONGODB_URI'];

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set. Add it to backend/.env');
    process.exit(1);
  }

  try {
    // Connection options for better performance and reliability
    const options = {
      maxPoolSize: 10, // Maximum number of connections in the pool
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      socketTimeoutMS: 45000, // Timeout for socket operations
    };

    await mongoose.connect(MONGODB_URI, options);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);

    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📴 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// Export connection for use in other parts of the app
export const getConnection = () => mongoose.connection;
