import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";

// GET - Fetch user's notifications
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

    const userId = decoded.userId;

    const notifications = await Notification.find({ recipient: userId })
      .populate('sender', 'username fullname profilePhoto profilePicture')
      .populate('post', 'caption mediaUrl')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      success: true,
      notifications: notifications.map(n => ({
        id: n._id.toString(),
        type: n.type,
        sender: {
          id: n.sender._id.toString(),
          username: n.sender.username,
          fullname: n.sender.fullname,
          profilePhoto: n.sender.profilePhoto,
          profilePicture: n.sender.profilePicture
        },
        message: n.message,
        post: n.post ? {
          id: n.post._id.toString(),
          caption: n.post.caption,
          mediaUrl: n.post.mediaUrl
        } : null,
        isRead: n.isRead,
        createdAt: n.createdAt
      }))
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR /notifications:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// PUT - Mark all as read
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

    const userId = decoded.userId;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    console.log(`✅ Marked all notifications as read for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read"
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR PUT /notifications:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}