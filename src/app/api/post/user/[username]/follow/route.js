import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { createNotification } from "@/lib/createNotification";

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { username } = await params;

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

    const currentUserId = decoded.userId;

    // Find target user
    const targetUser = await User.findOne({ username });
    
    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Can't follow yourself
    if (targetUser._id.toString() === currentUserId) {
      return NextResponse.json(
        { success: false, message: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    const currentUser = await User.findById(currentUserId);

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== targetUser._id.toString()
      );
      targetUser.followers = targetUser.followers.filter(
        id => id.toString() !== currentUserId.toString()
      );

      await currentUser.save();
      await targetUser.save();

      console.log(`👋 User ${currentUserId} unfollowed ${username}`);

      return NextResponse.json({
        success: true,
        isFollowing: false,
        followersCount: targetUser.followers.length,
        message: "Unfollowed successfully"
      }, { status: 200 });

    } else {
      // Follow
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUserId);

      await currentUser.save();
      await targetUser.save();

      console.log(`✅ User ${currentUserId} followed ${username}`);

      // ✅ CREATE NOTIFICATION FOR FOLLOW
      await createNotification({
        recipientId: targetUser._id,
        senderId: currentUserId,
        type: 'follow',
        message: 'started following you'
      });

      return NextResponse.json({
        success: true,
        isFollowing: true,
        followersCount: targetUser.followers.length,
        message: "Followed successfully"
      }, { status: 200 });
    }

  } catch (err) {
    console.error("❌ API ERROR /user/[username]/follow:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
