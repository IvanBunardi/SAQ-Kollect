// app/api/posts/create/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { verifyToken } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    // Verify user authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    // Parse form data
    const formData = await request.formData();
    const type = formData.get('type');
    const caption = formData.get('caption');
    const location = formData.get('location');
    const taggedPeople = formData.get('taggedPeople');
    const file = formData.get('file');

    // Validate required fields
    if (!type || !file) {
      return NextResponse.json(
        { message: 'Type and file are required' },
        { status: 400 }
      );
    }

    // Save file to public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s/g, '_');
    const filename = `${timestamp}_${originalName}`;
    const filepath = path.join(process.cwd(), 'public/uploads', filename);

    await writeFile(filepath, buffer);

    // Create media URL
    const mediaUrl = `/uploads/${filename}`;

    // Parse tagged people if exists
    let taggedPeopleArray = [];
    if (taggedPeople) {
      try {
        taggedPeopleArray = JSON.parse(taggedPeople);
      } catch (e) {
        // If not valid JSON, ignore
      }
    }

    // Create new post
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
    });

    await newPost.save();

    // Populate user data for response
    await newPost.populate('user', 'name username profilePicture');

    return NextResponse.json(
      {
        message: 'Post created successfully',
        post: newPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}