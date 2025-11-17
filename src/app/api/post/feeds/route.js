// app/api/posts/feeds/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
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

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Get all posts (you can add following filter later)
    const posts = await Post.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name username profilePicture')
      .populate('taggedPeople', 'name username')
      .populate('comments.user', 'name username profilePicture')
      .lean();

    // Get total count for pagination
    const total = await Post.countDocuments({ isActive: true });

    // Add additional info for each post
    const postsWithInfo = posts.map(post => ({
      ...post,
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0,
      savesCount: post.saves?.length || 0,
      isLikedByUser: post.likes?.includes(decoded.userId) || false,
      isSavedByUser: post.saves?.includes(decoded.userId) || false,
    }));

    return NextResponse.json(
      {
        posts: postsWithInfo,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get feeds error:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}