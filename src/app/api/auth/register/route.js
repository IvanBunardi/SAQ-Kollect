import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  console.log('📥 Register request received');

  try {
    const body = await req.json();
    const { email, password, fullname, username, role } = body;
    console.log('📦 Request body:', { ...body, password: '***' });

    // Validasi input
    if (!email || !password || !fullname || !username) {
      return Response.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validasi password length
    if (password.length < 6) {
      return Response.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Validasi username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return Response.json(
        { success: false, error: 'Username can only contain letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    // Connect ke database
    console.log('🔌 Connecting to database...');
    await dbConnect();
    console.log('✅ Database connected');

    // Cek apakah email sudah ada
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return Response.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Cek username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return Response.json(
        { success: false, error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Simpan user baru
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullname,
      username,
      role: role || 'kol',
    });

    console.log('✅ User created successfully:', user._id);

    return Response.json(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          id: user._id,
          email: user.email,
          fullname: user.fullname,
          username: user.username,
          role: user.role,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Register error:', error);

    // Duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return Response.json(
        { success: false, error: `${field} already exists` },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
