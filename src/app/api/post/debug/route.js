import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET() {
  try {
    await connectDB();

    // Get ALL posts (including inactive)
    const allPosts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get count
    const totalPosts = await Post.countDocuments({});
    const activePosts = await Post.countDocuments({ isActive: true });
    const inactivePosts = await Post.countDocuments({ isActive: false });

    return NextResponse.json({
      message: 'Debug info',
      counts: {
        total: totalPosts,
        active: activePosts,
        inactive: inactivePosts,
      },
      recentPosts: allPosts.map(post => ({
        id: post._id.toString(),
        userId: post.user?.toString(),
        type: post.type,
        caption: post.caption?.substring(0, 50),
        mediaUrl: post.mediaUrl,
        isActive: post.isActive,
        createdAt: post.createdAt,
      })),
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}