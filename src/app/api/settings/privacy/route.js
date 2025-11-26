import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// GET - Get user privacy settings
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

    const user = await User.findById(decoded.userId).select('isPrivate showActivity showEmail');

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      privacySettings: {
        isPrivate: user.isPrivate || false,
        showActivity: user.showActivity !== false, // default true
        showEmail: user.showEmail || false
      }
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR GET /settings/privacy:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// PUT - Update user privacy settings
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

    const { isPrivate, showActivity, showEmail } = await request.json();

    const updateData = {};
    if (typeof isPrivate === 'boolean') updateData.isPrivate = isPrivate;
    if (typeof showActivity === 'boolean') updateData.showActivity = showActivity;
    if (typeof showEmail === 'boolean') updateData.showEmail = showEmail;

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
      { new: true }
    ).select('isPrivate showActivity showEmail username');

    console.log(`✅ User ${user.username} updated privacy settings - isPrivate: ${user.isPrivate}`);

    return NextResponse.json({
      success: true,
      message: "Privacy settings updated successfully",
      privacySettings: {
        isPrivate: user.isPrivate,
        showActivity: user.showActivity,
        showEmail: user.showEmail
      }
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR PUT /settings/privacy:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}