// lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Jika sudah ada koneksi, return koneksi yang ada
  if (cached.conn) {
    console.log('🔄 Using existing MongoDB connection');
    return cached.conn;
  }

  // Jika belum ada promise, buat promise baru untuk koneksi
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    console.log('🔌 Connecting to MongoDB...');
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        cached.promise = null; // Reset promise on error
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Failed to establish MongoDB connection:', e.message);
    throw e;
  }

  return cached.conn;
}

// Event listeners untuk monitoring koneksi
if (mongoose.connection) {
  mongoose.connection.on('connected', () => {
    console.log('📡 MongoDB connection established');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('📴 MongoDB disconnected');
  });
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGINT', async () => {
    if (mongoose.connection) {
      await mongoose.connection.close();
      console.log('📴 MongoDB connection closed due to app termination');
    }
    process.exit(0);
  });
}

export default dbConnect;