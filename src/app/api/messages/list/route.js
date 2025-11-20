import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    await dbConnect();

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

    // Get all conversations for current user
    const userId = decoded.userId;

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

    // Group by conversation
    const conversations = {};
    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === userId 
        ? msg.recipient 
        : msg.sender;
      
      const conversationId = otherUser._id.toString();
      
      if (!conversations[conversationId]) {
        conversations[conversationId] = {
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0
        };
      }
    });

    return NextResponse.json({
      success: true,
      conversations: Object.values(conversations)
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR /messages/list:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}