import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { createNotification } from "@/lib/createNotification";

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { userId } = await params;

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

    const currentUserId = decoded.userId;

    if (currentUserId === userId) {
      return NextResponse.json(
        { success: false, message: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const currentUser = await User.findById(currentUserId);
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Current user not found" },
        { status: 404 }
      );
    }

    if (!currentUser.following) {
      currentUser.following = [];
    }
    
    if (!targetUser.followers) {
      targetUser.followers = [];
    }

    const alreadyFollowing = currentUser.following.some(
      id => id.toString() === userId.toString()
    );

    if (alreadyFollowing) {
      return NextResponse.json(
        { success: false, message: "Already following this user" },
        { status: 400 }
      );
    }

    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { followers: currentUserId }
    });

    console.log(`✅ User ${currentUserId} followed user ${userId}`);

    // ✅ CREATE NOTIFICATION
    await createNotification({
      recipientId: userId,
      senderId: currentUserId,
      type: 'follow',
      message: 'started following you'
    });

    return NextResponse.json({
      success: true,
      message: "Followed successfully"
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR /user/[userId]/follow:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// DELETE function tetap sama (unfollow)
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { userId } = await params;

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

    const currentUserId = decoded.userId;

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { followers: currentUserId }
    });

    console.log(`✅ User ${currentUserId} unfollowed user ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Unfollowed successfully"
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR DELETE /user/[userId]/follow:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}