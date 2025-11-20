import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await dbConnect();

    const { recipientUsername, content } = await request.json();

    if (!recipientUsername || !content) {
      return NextResponse.json(
        { success: false, message: "Recipient and content are required" },
        { status: 400 }
      );
    }

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

    const senderId = decoded.userId;

    // Find recipient
    const recipient = await User.findOne({ username: recipientUsername });
    
    if (!recipient) {
      return NextResponse.json(
        { success: false, message: "Recipient not found" },
        { status: 404 }
      );
    }

    console.log(`✅ Message sent from ${senderId} to ${recipient._id}`);
    console.log(`📨 Content: ${content}`);

    // TODO: Save message to database (you need Message model)
    // For now, just return success

    return NextResponse.json({
      success: true,
      message: "Message sent successfully"
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR /messages/send:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}