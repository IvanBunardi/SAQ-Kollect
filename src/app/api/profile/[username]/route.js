import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req, context) {
  try {
    await dbConnect();

    // ⬅️ PARAMS HARUS DI-AWAIT
    const { username } = await context.params;

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 🔥 TAMBAHKAN profilePhoto di response
    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        fullname: user.fullname,
        username: user.username,
        role: user.role,
        email: user.email || "",
        createdAt: user.createdAt,
        bio: user.bio || "",
        profilePhoto: user.profilePhoto || null, // ✅ TAMBAHKAN INI
        profilePicture: user.profilePicture || null, // ✅ TAMBAHKAN INI JUGA (backup)
        followersCount: user.followersCount || 0,
        followingCount: user.followingCount || 0,
        category: user.category || "Tech",
      },
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}