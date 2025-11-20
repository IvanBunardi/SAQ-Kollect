import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { createNotification } from "@/lib/createNotification";

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { postId } = await params;
    const { text } = await request.json();

    if (!text || text.trim() === '') {
      return NextResponse.json(
        { success: false, message: "Comment text is required" },
        { status: 400 }
      );
    }

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

    const post = await Post.findById(postId).populate('user', '_id username fullname');
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    const comment = await Comment.create({
      post: postId,
      user: userId,
      text: text.trim()
    });

    await comment.populate('user', 'username fullname profilePhoto profilePicture');

    console.log(`✅ Comment created on post ${postId} by user ${userId}`);

    // ✅ CREATE NOTIFICATION
    await createNotification({
      recipientId: post.user._id,
      senderId: userId,
      type: 'comment',
      postId: post._id,
      commentId: comment._id,
      message: `commented on your post: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`
    });

    return NextResponse.json({
      success: true,
      message: "Comment added successfully",
      comment: {
        _id: comment._id,
        text: comment.text,
        user: {
          _id: comment.user._id,
          username: comment.user.username,
          fullname: comment.user.fullname,
          profilePhoto: comment.user.profilePhoto,
          profilePicture: comment.user.profilePicture
        },
        createdAt: comment.createdAt
      }
    }, { status: 201 });

  } catch (err) {
    console.error("❌ API ERROR /post/[postId]/comment:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { postId } = await params;

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username fullname profilePhoto profilePicture')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      comments: comments.map(c => ({
        _id: c._id.toString(),
        text: c.text,
        user: {
          _id: c.user._id.toString(),
          username: c.user.username,
          fullname: c.user.fullname,
          profilePhoto: c.user.profilePhoto,
          profilePicture: c.user.profilePicture
        },
        createdAt: c.createdAt
      }))
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR GET /post/[postId]/comment:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}