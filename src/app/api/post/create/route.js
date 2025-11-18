export const runtime = "nodejs";
export const maxDuration = 60;

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { verifyToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(request) {
  try {
    console.log('📝 Create post request received');

    // Verify user authentication
    const token = request.cookies.get('token')?.value;
    console.log('🍪 Token from cookie:', token ? token.substring(0, 30) + '...' : 'NOT FOUND');

    if (!token) {
      console.error('❌ No token found in cookies');
      return NextResponse.json(
        { message: 'Unauthorized - No token found. Please login again.' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.error('❌ Invalid token');
      return NextResponse.json(
        { message: 'Unauthorized - Invalid token. Please login again.' },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated:', decoded.userId);

    await connectDB();
    console.log('✅ Database connected');

    // Parse form data
    const formData = await request.formData();
    const type = formData.get('type');
    const caption = formData.get('caption');
    const location = formData.get('location');
    const taggedPeople = formData.get('taggedPeople');
    const file = formData.get('file');

    console.log('📋 Form data:', { type, caption, location, hasFile: !!file });

    if (!type || !file) {
      return NextResponse.json(
        { message: 'Type and file are required' },
        { status: 400 }
      );
    }

    // Convert uploaded file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // File size limit
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: 'File too large. Max 100MB allowed.' },
        { status: 400 }
      );
    }

    console.log('📦 File size:', (buffer.length / (1024 * 1024)).toFixed(2), 'MB');

    // Ensure uploads folder exists
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
      console.log('📁 Created uploads directory');
    }

    // Save file with safe filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const safeFilename = file.name
      .replace(/\s/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');
    const filename = `${timestamp}_${safeFilename}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);
    console.log('💾 File saved:', filename);

    const mediaUrl = `/uploads/${filename}`;

    // Parse tagged people
    let taggedPeopleArray = [];
    if (taggedPeople) {
      try {
        taggedPeopleArray = JSON.parse(taggedPeople);
      } catch (e) {
        console.log('⚠️ Failed to parse tagged people:', e);
      }
    }

    // Create post
    const newPost = new Post({
      user: decoded.userId,
      type,
      caption: caption || '',
      mediaUrl,
      location: location || '',
      taggedPeople: taggedPeopleArray,
      likes: [],
      comments: [],
      saves: [],
      isActive: true,
    });

    await newPost.save();
    await newPost.populate('user', 'name username profilePicture');

    console.log('✅ Post created successfully:', newPost._id);

    return NextResponse.json(
      {
        message: 'Post created successfully',
        post: newPost,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Create post error:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}