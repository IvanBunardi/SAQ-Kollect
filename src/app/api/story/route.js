import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Story from "@/models/story";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// POST - Create new story
export async function POST(request) {
  try {
    await dbConnect();

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
    const { mediaUrl, mediaType, caption } = await request.json();

    if (!mediaUrl) {
      return NextResponse.json(
        { success: false, message: "Media URL is required" },
        { status: 400 }
      );
    }

    const story = await Story.create({
      user: userId,
      mediaUrl,
      mediaType: mediaType || 'image',
      caption: caption || '',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    await story.populate('user', 'username fullname profilePhoto');

    console.log(`✅ Story created by user ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Story created successfully",
      story: {
        _id: story._id,
        user: story.user,
        mediaUrl: story.mediaUrl,
        mediaType: story.mediaType,
        caption: story.caption,
        viewersCount: 0,
        likesCount: 0,
        createdAt: story.createdAt,
        expiresAt: story.expiresAt
      }
    }, { status: 201 });

  } catch (err) {
    console.error("❌ API ERROR POST /story:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// GET - Get stories from following users
export async function GET(request) {
  try {
    await dbConnect();

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

    // Get current user's following list
    const currentUser = await User.findById(userId).select('following');
    
    // Include own stories + following users' stories
    const userIds = [userId, ...currentUser.following];

    // Get active stories (not expired)
    const stories = await Story.find({
      user: { $in: userIds },
      isActive: true,
      expiresAt: { $gt: new Date() }
    })
    .populate('user', 'username fullname profilePhoto profilePicture')
    .sort({ createdAt: -1 })
    .lean();

    // Group stories by user
    const storiesByUser = {};
    
    stories.forEach(story => {
      const oduserId = story.user._id.toString();
      
      if (!storiesByUser[oduserId]) {
        storiesByUser[oduserId] = {
          user: {
            _id: story.user._id,
            username: story.user.username,
            fullname: story.user.fullname,
            profilePhoto: story.user.profilePhoto,
            profilePicture: story.user.profilePicture
          },
          stories: [],
          hasUnviewed: false
        };
      }
      
      const isViewed = story.viewers.some(v => v.user.toString() === userId);
      
      storiesByUser[oduserId].stories.push({
        _id: story._id,
        mediaUrl: story.mediaUrl,
        mediaType: story.mediaType,
        caption: story.caption,
        viewersCount: story.viewers.length,
        likesCount: story.likes.length,
        isViewed,
        isLiked: story.likes.some(id => id.toString() === userId),
        createdAt: story.createdAt,
        expiresAt: story.expiresAt
      });
      
      if (!isViewed) {
        storiesByUser[oduserId].hasUnviewed = true;
      }
    });

    // Convert to array and sort (unviewed first, then own story)
    const storyUsers = Object.values(storiesByUser).sort((a, b) => {
      // Own story first
      if (a.user._id.toString() === userId) return -1;
      if (b.user._id.toString() === userId) return 1;
      // Then unviewed
      if (a.hasUnviewed && !b.hasUnviewed) return -1;
      if (!a.hasUnviewed && b.hasUnviewed) return 1;
      return 0;
    });

    return NextResponse.json({
      success: true,
      storyUsers
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR GET /story:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}