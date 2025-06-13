import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Increased timeout to 10s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain a minimum of 2 socket connections
      retryWrites: true,
      w: 'majority',
    };

    console.log('Connecting to MongoDB Atlas...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB Atlas successfully');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB Atlas connection failed:', error.message);
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', e.message);
    
    // More specific error messages
    if (e.message.includes('ENOTFOUND')) {
      console.error('🔧 DNS Resolution Error: Check if your cluster is running and the hostname is correct');
    } else if (e.message.includes('authentication failed')) {
      console.error('🔧 Authentication Error: Check your username and password');
    } else if (e.message.includes('IP not whitelisted')) {
      console.error('🔧 Network Access Error: Add your IP to the whitelist in Atlas');
    }
    
    throw e;
  }

  return cached.conn;
}

export default connectDB;
