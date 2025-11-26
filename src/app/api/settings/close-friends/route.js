import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// GET - Get close friends list
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

    const user = await User.findById(decoded.userId)
      .populate('closeFriends', 'username fullname profilePhoto _id')
      .select('closeFriends');

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const closeFriends = user.closeFriends || [];

    return NextResponse.json({
      success: true,
      closeFriends: closeFriends.map(u => ({
        _id: u._id,
        username: u.username,
        fullname: u.fullname,
        profilePhoto: u.profilePhoto
      })),
      totalCloseFriends: closeFriends.length
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR GET /settings/close-friends:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// POST - Add user to close friends
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

    const { userIdToAdd } = await request.json();

    if (!userIdToAdd) {
      return NextResponse.json(
        { success: false, message: "userIdToAdd is required" },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userIdToAdd)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Can't add yourself
    if (userIdToAdd === decoded.userId) {
      return NextResponse.json(
        { success: false, message: "You cannot add yourself as a close friend" },
        { status: 400 }
      );
    }

    // Check if user exists
    const friendUser = await User.findById(userIdToAdd);
    if (!friendUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Add to closeFriends
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      {
        $addToSet: { closeFriends: userIdToAdd }
      },
      { new: true }
    ).select('username');

    console.log(`✅ User ${user.username} added ${friendUser.username} as close friend`);

    return NextResponse.json({
      success: true,
      message: `${friendUser.username} added to close friends`,
      userId: userIdToAdd,
      closeFriendData: {
        _id: friendUser._id,
        username: friendUser.username,
        fullname: friendUser.fullname,
        profilePhoto: friendUser.profilePhoto
      }
    }, { status: 201 });

  } catch (err) {
    console.error("❌ API ERROR POST /settings/close-friends:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove user from close friends
export async function DELETE(request) {
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

    const { searchParams } = new URL(request.url);
    const userIdToRemove = searchParams.get('userId');

    if (!userIdToRemove) {
      return NextResponse.json(
        { success: false, message: "userId query parameter is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userIdToRemove)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const friendUser = await User.findById(userIdToRemove).select('username');
    if (!friendUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Remove from closeFriends
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      {
        $pull: { closeFriends: userIdToRemove }
      },
      { new: true }
    ).select('username');

    console.log(`✅ User ${user.username} removed ${friendUser.username} from close friends`);

    return NextResponse.json({
      success: true,
      message: `${friendUser.username} removed from close friends`,
      removedUserId: userIdToRemove
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR DELETE /settings/close-friends:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}