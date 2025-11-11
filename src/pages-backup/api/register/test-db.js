// app/api/test-db/route.js
// Test endpoint untuk memastikan koneksi MongoDB bekerja
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    console.log('🧪 Testing database connection...');
    
    // Test connection
    await dbConnect();
    console.log('✅ Database connected successfully');

    // Test query
    const userCount = await User.countDocuments();
    console.log(`👥 Total users in database: ${userCount}`);

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}