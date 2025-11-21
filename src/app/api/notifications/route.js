import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import User from "@/models/User";
import Post from "@/models/Post";
import Campaign from "@/models/Campaign";
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
    console.log('📬 Fetching notifications for:', userId);

    const notifications = await Notification.find({ recipient: userId })
      .populate('sender', 'username fullname profilePhoto profilePicture')
      .populate('post', 'caption mediaUrl')
      .populate('campaign', 'title')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    console.log('📬 Found notifications:', notifications.length);

    const formattedNotifications = notifications.map(n => ({
      id: n._id.toString(),
      type: n.type,
      sender: n.sender ? {
        id: n.sender._id.toString(),
        username: n.sender.username,
        fullname: n.sender.fullname,
        profilePhoto: n.sender.profilePhoto,
        profilePicture: n.sender.profilePicture
      } : null,
      message: n.message,
      post: n.post ? {
        id: n.post._id.toString(),
        caption: n.post.caption,
        mediaUrl: n.post.mediaUrl
      } : null,
      campaign: n.campaign ? {
        id: n.campaign._id.toString(),
        title: n.campaign.title
      } : null,
      data: n.data || {},
      isRead: n.isRead,
      createdAt: n.createdAt
    }));

    return NextResponse.json({
      success: true,
      notifications: formattedNotifications
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR GET /notifications:", err);
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

    await Notification.updateMany(
      { recipient: decoded.userId, isRead: false },
      { isRead: true }
    );

    return NextResponse.json({
      success: true,
      message: "All marked as read"
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR PUT /notifications:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}