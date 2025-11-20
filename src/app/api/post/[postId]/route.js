import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { postId } = await params;

    const token = request.cookies.get('token')?.value;
    let userId = null;

    if (token) {
      const jwt = require('jsonwebtoken');
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (jwtError) {
        // Token invalid, continue as guest
      }
    }

    const post = await Post.findById(postId)
      .populate('user', 'username fullname profilePhoto profilePicture name')
      .lean();

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    const isLikedByUser = userId ? post.likes.some((id) => id.toString() === userId.toString()) : false;
    const isSavedByUser = userId ? post.saves.some((id) => id.toString() === userId.toString()) : false;

    return NextResponse.json({
      success: true,
      post: {
        _id: post._id.toString(),
        user: {
          _id: post.user._id.toString(),
          username: post.user.username,
          name: post.user.fullname || post.user.name || post.user.username,
          profilePhoto: post.user.profilePhoto,
          profilePicture: post.user.profilePicture
        },
        type: post.type,
        caption: post.caption,
        mediaUrl: post.mediaUrl,
        location: post.location,
        likesCount: post.likes.length,
        commentsCount: post.comments?.length || 0,
        savesCount: post.saves.length,
        isLikedByUser,
        isSavedByUser,
        createdAt: post.createdAt
      }
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR /post/[postId]:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
