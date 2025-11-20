import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { username } = await params;

    console.log("📡 Fetching profile for username:", username);

    // Cari user berdasarkan username
    const user = await User.findOne({ username }).select('-password').lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Check if current user is following this user
    let isFollowing = false;
    const token = request.cookies.get('token')?.value;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUserId = decoded.userId;
        
        // Check if current user is in the followers list
        isFollowing = user.followers?.some(id => id.toString() === currentUserId.toString()) || false;
      } catch (err) {
        console.log("⚠️ Invalid token, continuing as guest");
      }
    }

    console.log("✅ User found:", user.username);

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
        isFollowing: isFollowing, // ✅ CHECK IF FOLLOWING
      }
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR /profile/[username]:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}