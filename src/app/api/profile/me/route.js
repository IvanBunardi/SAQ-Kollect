// app/api/profile/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    await dbConnect();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Find user by ID from token payload
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'User account is inactive' },
        { status: 403 }
      );
    }

    // Return user profile data
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        role: user.role,
        profilePhoto: user.profilePhoto,
        bio: user.bio,
        website: user.website,
        gender: user.gender,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get update data from request body
    const body = await request.json();
    const { fullname, username, bio, website, gender } = body;

    // Validate input
    if (!fullname && !username && !bio && !website && !gender) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      );
    }

    // Prepare update object
    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (username) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (website !== undefined) updateData.website = website;
    if (gender) updateData.gender = gender;

    // Find and update user
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        role: user.role,
        profilePhoto: user.profilePhoto,
        bio: user.bio,
        website: user.website,
        gender: user.gender,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    // Handle duplicate username error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Username already exists' },
        { status: 400 }
      );
    }

    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
export async function PATCH(request) {
  try {
    await dbConnect();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('photo');

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Update user with new photo
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { 
        profilePhoto: base64Image,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ Profile photo updated for user:', user.username);

    return NextResponse.json({
      success: true,
      message: 'Profile photo updated successfully',
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        role: user.role,
        profilePhoto: user.profilePhoto,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Remove profile photo
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { 
        profilePhoto: null,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile photo removed successfully',
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        role: user.role,
        profilePhoto: null,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

  } catch (error) {
    console.error('Photo delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}