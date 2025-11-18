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

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        fullname: user.fullname,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        bio: user.bio || "",
        profilePicture: user.profilePicture || "",
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
