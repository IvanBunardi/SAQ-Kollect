import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// GET - Get user language preference
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

    const user = await User.findById(decoded.userId).select('language');

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      language: user.language || 'en'
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR GET /settings/language:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// PUT - Update user language preference
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

    const { language } = await request.json();

    // Validate language
    const supportedLanguages = ['en', 'id', 'es', 'fr', 'de', 'ja', 'zh'];
    if (!supportedLanguages.includes(language)) {
      return NextResponse.json(
        { success: false, message: "Unsupported language" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { language },
      { new: true }
    ).select('language username fullname');

    console.log(`✅ User ${user.username} changed language to ${language}`);

    return NextResponse.json({
      success: true,
      message: "Language updated successfully",
      language: user.language
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR PUT /settings/language:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}