import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// GET - Get user notification preferences
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

    const user = await User.findById(decoded.userId).select('notificationSettings');

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Default settings jika tidak ada
    const defaultSettings = {
      likes: true,
      comments: true,
      follows: true,
      mentions: true,
      campaigns: true,
      messages: true,
      email: true,
      push: true
    };

    const settings = user.notificationSettings || defaultSettings;

    return NextResponse.json({
      success: true,
      notificationSettings: settings
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR GET /settings/notifications:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// PUT - Update user notification preferences
export async function PUT(request) {
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

    const { notificationSettings } = await request.json();

    // Validate settings
    const validKeys = ['likes', 'comments', 'follows', 'mentions', 'campaigns', 'messages', 'email', 'push'];
    for (const key in notificationSettings) {
      if (!validKeys.includes(key)) {
        return NextResponse.json(
          { success: false, message: `Invalid setting key: ${key}` },
          { status: 400 }
        );
      }
      if (typeof notificationSettings[key] !== 'boolean') {
        return NextResponse.json(
          { success: false, message: `Setting ${key} must be boolean` },
          { status: 400 }
        );
      }
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { notificationSettings },
      { new: true }
    ).select('notificationSettings username');

    console.log(`✅ User ${user.username} updated notification settings`);

    return NextResponse.json({
      success: true,
      message: "Notification settings updated successfully",
      notificationSettings: user.notificationSettings
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR PUT /settings/notifications:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}