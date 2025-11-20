// app/api/posts/feeds/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { verifyToken } from '@/lib/auth';
import User from "@/models/User";

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

    // Pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Query posts
    const posts = await Post.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

      // FIX: gunakan FULLNAME bukan name
      .populate('user', 'fullname username profilePhoto role')
      .populate('taggedPeople', 'fullname username profilePicture')

      // FIX COMMENTS user full info
      .populate('comments.user', 'fullname username profilePicture')
      .lean();

    // Total post count
    const total = await Post.countDocuments({ isActive: true });

    // Formatting output
    const postsWithInfo = posts.map(post => ({
      ...post,
      // FIX: Like count, save count, etc
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0,
      savesCount: post.saves?.length || 0,
      isLikedByUser: post.likes?.includes(decoded.userId) || false,
      isSavedByUser: post.saves?.includes(decoded.userId) || false,

      // FIX USER NAME OUTPUT → AGAR FE TETAP BISA PAKAI post.user.name
      user: {
        ...post.user,
        name: post.user?.fullname || post.user?.username || "Unknown",
      },

      // FIX TAGGED PEOPLE NAME
      taggedPeople: post.taggedPeople?.map(tp => ({
        ...tp,
        name: tp.fullname || tp.username,
      })) || [],

      // FIX COMMENTS NAME
      comments: post.comments?.map(c => ({
        ...c,
        user: c.user
          ? {
              ...c.user,
              name: c.user.fullname || c.user.username,
            }
          : null,
      })) || [],
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
