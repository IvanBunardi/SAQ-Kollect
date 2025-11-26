import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await dbConnect();

    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ success: false }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Create test notification to YOURSELF
    const notif = await Notification.create({
      recipient: userId,
      sender: userId,
      type: 'campaign_invite',
      message: 'wants to hire you for "Test Campaign"',
      data: { campaignName: 'Test Campaign', budget: 5000 }
    });

    console.log('✅ Test notification created:', notif._id);

    return NextResponse.json({ success: true, notif }, { status: 201 });
  } catch (err) {
    console.error('❌ Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}