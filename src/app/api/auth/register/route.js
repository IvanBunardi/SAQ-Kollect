import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  console.log('📥 Register request received');

  try {
    const body = await req.json();
    const { email, password, fullname, username, accountType } = body;
    
    console.log('📦 Request body:', { 
      email, 
      fullname, 
      username, 
      accountType,
      password: '***' 
    });

    // ✅ Validasi input
    if (!email || !password || !fullname || !username) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // ✅ Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // ✅ Validasi password length
    if (password.trim().length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // ✅ Validasi username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { success: false, error: 'Username can only contain letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    // ✅ Connect ke database
    console.log('🔌 Connecting to database...');
    await dbConnect();
    console.log('✅ Database connected');

    // ✅ Cek email duplikat
    const existingEmail = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });
    
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    // ✅ Cek username duplikat
    const existingUsername = await User.findOne({ 
      username: username.toLowerCase().trim() 
    });
    
    if (existingUsername) {
      return NextResponse.json(
        { success: false, error: 'Username already taken' },
        { status: 400 }
      );
    }

    // ✅ Create user - password akan di-hash otomatis oleh pre-save hook
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: password.trim(), // ❌ TIDAK di-hash di sini!
      fullname: fullname.trim(),
      username: username.toLowerCase().trim(),
      accountType: accountType || 'kol'
    });

    console.log('✅ User created successfully:', user._id);
    console.log('👤 Username:', user.username);
    console.log('📧 Email:', user.email);
    console.log('🎭 Account Type:', user.accountType);

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          id: user._id,
          email: user.email,
          fullname: user.fullname,
          username: user.username,
          accountType: user.accountType
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Register error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { success: false, error: `${field} already exists` },
        { status: 400 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}