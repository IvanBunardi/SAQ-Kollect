import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";  // ← FIX: Pakai alias @
import Message from "@/models/Message";  // ← FIX: Nama model yang benar
import jwt from "jsonwebtoken";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID missing" },
        { status: 400 }
      );
    }

    // Verify token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Get messages for this user
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { recipient: userId }
      ]
    })
    .populate('sender', 'username fullname profilePhoto')
    .populate('recipient', 'username fullname profilePhoto')
    .sort({ createdAt: -1 })
    .lean();

    return NextResponse.json({
      success: true,
      messages
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR /messages/[userId]:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}