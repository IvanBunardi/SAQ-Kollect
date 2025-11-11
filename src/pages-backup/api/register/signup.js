// app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  console.log('📥 Signup request received');
  
  try {
    // Parse request body
    const body = await request.json();
    console.log('📦 Request body:', { ...body, password: '***' });
    
    const { email, password, fullname, username, role } = body;

    // Validasi input lebih detail
    if (!email || !password || !fullname || !username) {
      console.log('❌ Validation failed: Missing fields');
      return NextResponse.json(
        { error: 'All fields are required', success: false },
        { status: 400 }
      );
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Validation failed: Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format', success: false },
        { status: 400 }
      );
    }

    // Validasi password length
    if (password.length < 6) {
      console.log('❌ Validation failed: Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 6 characters', success: false },
        { status: 400 }
      );
    }

    // Validasi username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      console.log('❌ Validation failed: Invalid username format');
      return NextResponse.json(
        { error: 'Username can only contain letters, numbers, and underscores', success: false },
        { status: 400 }
      );
    }

    // Connect to database
    console.log('🔌 Connecting to database...');
    await dbConnect();
    console.log('✅ Database connected');

    // Check if email already exists
    console.log('🔍 Checking if email exists...');
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      console.log('❌ Email already exists');
      return NextResponse.json(
        { error: 'Email already registered', success: false },
        { status: 400 }
      );
    }

    // Check if username already exists
    console.log('🔍 Checking if username exists...');
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log('❌ Username already exists');
      return NextResponse.json(
        { error: 'Username already taken', success: false },
        { status: 400 }
      );
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    console.log('👤 Creating new user...');
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullname,
      username,
      role: role || 'kol'
    });

    console.log('✅ User created successfully:', user._id);

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          id: user._id,
          email: user.email,
          fullname: user.fullname,
          username: user.username,
          role: user.role
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Signup error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: Object.values(error.errors).map(e => e.message).join(', '), success: false },
        { status: 400 }
      );
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `${field} already exists`, success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again.', success: false },
      { status: 500 }
    );
  }
}