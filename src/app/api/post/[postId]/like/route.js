import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { createNotification } from "@/lib/createNotification";

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { postId } = await params;

    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const jwt = require('jsonwebtoken');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    const post = await Post.findById(postId).populate('user', '_id username');
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    const isLiked = post.likes.includes(userId);
    
    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
      await post.save();
      
      console.log(`👎 User ${userId} unliked post ${postId}`);
      
      return NextResponse.json({
        success: true,
        isLiked: false,
        likesCount: post.likes.length,
        message: "Post unliked"
      }, { status: 200 });
    } else {
      // Like
      post.likes.push(userId);
      await post.save();
      
      console.log(`❤️ User ${userId} liked post ${postId}`);

      // ✅ CREATE NOTIFICATION FOR LIKE
      await createNotification({
        recipientId: post.user._id,
        senderId: userId,
        type: 'like',
        postId: post._id,
        message: 'liked your post'
      });

      return NextResponse.json({
        success: true,
        isLiked: true,
        likesCount: post.likes.length,
        message: "Post liked"
      }, { status: 200 });
    }

  } catch (err) {
    console.error("❌ API ERROR /post/[postId]/like:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}