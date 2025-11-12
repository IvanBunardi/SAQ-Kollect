// src/pages-backup/api/auth/register.js
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed', 
      success: false 
    });
  }

  console.log('📥 Register request received');

  try {
    const { email, password, fullname, username, role } = req.body;
    console.log('📦 Request body:', { ...req.body, password: '***' });

    // Validasi input
    if (!email || !password || !fullname || !username) {
      console.log('❌ Validation failed: Missing fields');
      return res.status(400).json({
        error: 'All fields are required',
        success: false
      });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Validation failed: Invalid email format');
      return res.status(400).json({
        error: 'Invalid email format',
        success: false
      });
    }

    // Validasi password length
    if (password.length < 6) {
      console.log('❌ Validation failed: Password too short');
      return res.status(400).json({
        error: 'Password must be at least 6 characters',
        success: false
      });
    }

    // Validasi username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      console.log('❌ Validation failed: Invalid username format');
      return res.status(400).json({
        error: 'Username can only contain letters, numbers, and underscores',
        success: false
      });
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
      return res.status(400).json({
        error: 'Email already registered',
        success: false
      });
    }

    // Check if username already exists
    console.log('🔍 Checking if username exists...');
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log('❌ Username already exists');
      return res.status(400).json({
        error: 'Username already taken',
        success: false
      });
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

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Register error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: Object.values(error.errors).map(e => e.message).join(', '),
        success: false
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        error: `${field} already exists`,
        success: false
      });
    }

    return res.status(500).json({
      error: 'Internal server error. Please try again.',
      success: false
    });
  }
}