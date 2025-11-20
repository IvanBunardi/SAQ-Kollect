import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    await dbConnect();

    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    const user = await User.findById(userId).select('-password').lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        profilePicture: user.profilePicture,
        bio: user.bio,
        category: user.category,
        createdAt: user.createdAt,
        followersCount: user.followers?.length || 0, // ✅ REAL COUNT
        followingCount: user.following?.length || 0, // ✅ REAL COUNT
      }
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR /profile:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}