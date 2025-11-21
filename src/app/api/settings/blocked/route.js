import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// GET - Get list of blocked users
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
      .populate('blockedUsers', 'username fullname profilePhoto _id')
      .select('blockedUsers');

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const blockedUsers = user.blockedUsers || [];

    return NextResponse.json({
      success: true,
      blockedUsers: blockedUsers.map(u => ({
        _id: u._id,
        username: u.username,
        fullname: u.fullname,
        profilePhoto: u.profilePhoto
      }))
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR GET /settings/blocked:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// POST - Block a user
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

    const { userIdToBlock } = await request.json();

    if (!userIdToBlock) {
      return NextResponse.json(
        { success: false, message: "userIdToBlock is required" },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userIdToBlock)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Can't block yourself
    if (userIdToBlock === decoded.userId) {
      return NextResponse.json(
        { success: false, message: "You cannot block yourself" },
        { status: 400 }
      );
    }

    // Check if user exists
    const userToBlock = await User.findById(userIdToBlock);
    if (!userToBlock) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Add to blockedUsers
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      {
        $addToSet: { blockedUsers: userIdToBlock }
      },
      { new: true }
    ).select('username');

    console.log(`✅ User ${user.username} blocked user ${userToBlock.username}`);

    return NextResponse.json({
      success: true,
      message: `${userToBlock.username} has been blocked`,
      blockedUserId: userIdToBlock
    }, { status: 201 });

  } catch (err) {
    console.error("❌ API ERROR POST /settings/blocked:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// DELETE - Unblock a user
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
    const userIdToUnblock = searchParams.get('userId');

    if (!userIdToUnblock) {
      return NextResponse.json(
        { success: false, message: "userId query parameter is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userIdToUnblock)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const userToUnblock = await User.findById(userIdToUnblock).select('username');
    if (!userToUnblock) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Remove from blockedUsers
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      {
        $pull: { blockedUsers: userIdToUnblock }
      },
      { new: true }
    ).select('username');

    console.log(`✅ User ${user.username} unblocked user ${userToUnblock.username}`);

    return NextResponse.json({
      success: true,
      message: `${userToUnblock.username} has been unblocked`,
      unblockedUserId: userIdToUnblock
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR DELETE /settings/blocked:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}