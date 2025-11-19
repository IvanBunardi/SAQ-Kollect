import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get posts sorted by engagement (likes, comments, createdAt)
    const posts = await Post.find()
      .populate({
        path: "user",
        select: "fullname username profilePhoto profilePicture",
      })
      .sort({ createdAt: -1 }) // You can add more sophisticated sorting based on engagement
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    const formattedPosts = posts.map(post => ({
      id: post._id.toString(),
      caption: post.caption || "",
      mediaUrl: post.mediaUrl || null,
      mediaType: post.mediaType || "image",
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0,
      createdAt: post.createdAt,
      user: {
        id: post.user._id.toString(),
        fullname: post.user.fullname,
        username: post.user.username,
        profilePhoto: post.user.profilePhoto || post.user.profilePicture || null,
      },
    }));

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });

  } catch (error) {
    console.error("Explore Feed API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}