import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Story from "@/models/story";
import jwt from "jsonwebtoken";

// GET - View story (mark as viewed)
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { storyId } = await params;

    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

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

    const story = await Story.findById(storyId)
      .populate('user', 'username fullname profilePhoto')
      .populate('viewers.user', 'username fullname profilePhoto');

    if (!story) {
      return NextResponse.json(
        { success: false, message: "Story not found" },
        { status: 404 }
      );
    }

    // Mark as viewed if not already
    const alreadyViewed = story.viewers.some(v => v.user._id.toString() === userId);
    
    if (!alreadyViewed && story.user._id.toString() !== userId) {
      story.viewers.push({ user: userId, viewedAt: new Date() });
      await story.save();
    }

    return NextResponse.json({
      success: true,
      story: {
        _id: story._id,
        user: story.user,
        mediaUrl: story.mediaUrl,
        mediaType: story.mediaType,
        caption: story.caption,
        viewers: story.viewers,
        viewersCount: story.viewers.length,
        likesCount: story.likes.length,
        isLiked: story.likes.some(id => id.toString() === userId),
        createdAt: story.createdAt,
        expiresAt: story.expiresAt
      }
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR GET /story/[storyId]:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// POST - Like story
export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { storyId } = await params;

    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

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

    const story = await Story.findById(storyId);

    if (!story) {
      return NextResponse.json(
        { success: false, message: "Story not found" },
        { status: 404 }
      );
    }

    const isLiked = story.likes.includes(userId);

    if (isLiked) {
      story.likes = story.likes.filter(id => id.toString() !== userId);
    } else {
      story.likes.push(userId);
    }

    await story.save();

    return NextResponse.json({
      success: true,
      isLiked: !isLiked,
      likesCount: story.likes.length
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR POST /story/[storyId]:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}