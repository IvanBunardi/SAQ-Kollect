import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    // ✅ Await params (Next.js 15)
    const { username } = await params;

    console.log("📡 Fetching posts for user:", username);

    // Cari user berdasarkan username
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Get current user ID dari token (untuk cek isLiked dan isSaved)
    let currentUserId = null;
    const token = request.cookies.get('token')?.value;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentUserId = decoded.userId;
      } catch (err) {
        console.log("⚠️ Invalid token, continuing as guest");
      }
    }

    // Get semua posts dari user ini
    const posts = await Post.find({ 
      user: user._id,
      isActive: true 
    })
    .populate('user', 'username fullname profilePhoto')
    .sort({ createdAt: -1 }) // Newest first
    .lean();

    // Format response dengan isLikedByUser dan isSavedByUser
    const formattedPosts = posts.map(post => ({
      _id: post._id.toString(),
      user: {
        _id: post.user._id.toString(),
        name: post.user.fullname,
        username: post.user.username,
        profilePhoto: post.user.profilePhoto
      },
      type: post.type,
      caption: post.caption || '',
      mediaUrl: post.mediaUrl,
      location: post.location || '',
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0,
      savesCount: post.saves?.length || 0,
      isLikedByUser: currentUserId ? post.likes?.some(id => id.toString() === currentUserId.toString()) : false,
      isSavedByUser: currentUserId ? post.saves?.some(id => id.toString() === currentUserId.toString()) : false,
      createdAt: post.createdAt
    }));

    console.log(`✅ Found ${formattedPosts.length} posts for user ${username}`);

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      totalPosts: formattedPosts.length
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR /post/user/[username]:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}