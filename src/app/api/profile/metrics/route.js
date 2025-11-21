import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";

// GET - Get performance metrics for a user
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

    // Get user data
    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Get all posts by this user
    const posts = await Post.find({ user: userId }).lean();

    const totalPosts = posts.length;
    const followersCount = user.followers?.length || 0;

    if (totalPosts === 0) {
      return NextResponse.json({
        success: true,
        metrics: {
          avgEngagementRate: 0,
          avgLikesPerPost: 0,
          avgCommentsPerPost: 0,
          totalReach: 0,
          totalLikes: 0,
          totalComments: 0,
          totalSaves: 0,
          totalPosts: 0,
          postFrequency: 0,
          bestPerformingPost: null
        }
      }, { status: 200 });
    }

    // Calculate totals
    let totalLikes = 0;
    let totalComments = 0;
    let totalSaves = 0;
    let bestPost = null;
    let maxEngagement = 0;

    posts.forEach(post => {
      const likes = post.likes?.length || 0;
      const comments = post.commentsCount || 0;
      const saves = post.saves?.length || 0;
      
      totalLikes += likes;
      totalComments += comments;
      totalSaves += saves;

      const engagement = likes + comments + saves;
      if (engagement > maxEngagement) {
        maxEngagement = engagement;
        bestPost = post;
      }
    });

    // Calculate averages
    const avgLikesPerPost = totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0;
    const avgCommentsPerPost = totalPosts > 0 ? Math.round(totalComments / totalPosts) : 0;
    
    // Engagement rate = (Likes + Comments) / Followers * 100
    let avgEngagementRate = 0;
    if (followersCount > 0) {
      avgEngagementRate = ((totalLikes + totalComments) / totalPosts / followersCount * 100).toFixed(1);
    } else if (totalPosts > 0) {
      // Alternative: if no followers, show engagement per post (scaled to look like %)
      avgEngagementRate = Math.min(((totalLikes + totalComments) / totalPosts), 99).toFixed(1);
    }

    // Post frequency (posts per month)
    const now = new Date();
    const oldestPost = posts.reduce((oldest, post) => {
      const postDate = new Date(post.createdAt);
      return postDate < oldest ? postDate : oldest;
    }, now);
    
    const monthsActive = Math.max(1, Math.ceil((now - oldestPost) / (30 * 24 * 60 * 60 * 1000)));
    const postFrequency = Math.round(totalPosts / monthsActive * 10) / 10;

    // Total reach (estimated)
    const totalReach = totalLikes + totalComments + totalSaves;

    return NextResponse.json({
      success: true,
      metrics: {
        avgEngagementRate: parseFloat(avgEngagementRate),
        avgLikesPerPost,
        avgCommentsPerPost,
        totalReach,
        totalLikes,
        totalComments,
        totalSaves,
        totalPosts,
        postFrequency,
        followersCount,
        bestPerformingPost: bestPost ? {
          _id: bestPost._id,
          caption: bestPost.caption,
          mediaUrl: bestPost.mediaUrl,
          engagement: maxEngagement
        } : null
      }
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR GET /profile/metrics:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}