import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import User from "@/models/User";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";

export async function POST(request) {
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

    const senderId = decoded.userId;
    const body = await request.json();
    
    console.log("🔍 DEBUG: Request body:", JSON.stringify(body, null, 2));

    const {
      targetKolUsername,
      campaignName,
      brandName,
      industry,
      description,
      targetAudience,
      budgetRange,
      startDate,
      deadline,
      contentTypes,
      requirements
    } = body;

    console.log("🔍 DEBUG: targetKolUsername =", targetKolUsername);

    if (!campaignName || !description) {
      return NextResponse.json(
        { success: false, message: "Campaign name and description are required" },
        { status: 400 }
      );
    }

    let targetKol = null;
    if (targetKolUsername) {
      console.log("🔍 DEBUG: Searching for KOL with username:", targetKolUsername);
      targetKol = await User.findOne({ username: targetKolUsername });
      console.log("🔍 DEBUG: Found targetKol?", !!targetKol);
      if (targetKol) {
        console.log("🔍 DEBUG: targetKol ID:", targetKol._id, "Username:", targetKol.username);
      }
    } else {
      console.log("🔍 DEBUG: No targetKolUsername provided");
    }

    let budgetMin = 0;
    let budgetMax = 0;
    if (budgetRange) {
      const budgetParts = budgetRange.replace(/[^0-9-]/g, '').split('-');
      budgetMin = parseInt(budgetParts[0]) || 0;
      budgetMax = parseInt(budgetParts[1]) || budgetMin;
    }

    const deliverables = [];
    if (contentTypes && Array.isArray(contentTypes)) {
      contentTypes.forEach(type => {
        let deliverableType = type;
        if (type === 'IG Feeds') deliverableType = 'ig_post';
        if (type === 'IG Reels') deliverableType = 'ig_reel';
        if (type === 'IG Story') deliverableType = 'ig_story';
        if (type === 'TikTok') deliverableType = 'tiktok';
        if (type === 'YouTube') deliverableType = 'youtube';
        if (type === 'X (Twitter)') deliverableType = 'twitter';
        
        deliverables.push({
          type: deliverableType,
          count: 1,
          description: ''
        });
      });
    }

    const validCategories = ['fashion', 'beauty', 'tech', 'food', 'travel', 'lifestyle', 'gaming', 'fitness', 'other'];
    const categoryLower = industry?.toLowerCase() || 'other';
    const category = validCategories.includes(categoryLower) ? categoryLower : 'other';

    console.log("🔍 DEBUG: Creating campaign...");

    const campaign = await Campaign.create({
      brand: senderId,
      title: campaignName,
      description: description,
      category: category,
      budget: {
        min: budgetMin,
        max: budgetMax
      },
      requirements: deliverables,
      targetAudience: {
        description: targetAudience || ''
      },
      deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applicationDeadline: startDate ? new Date(startDate) : new Date(),
      status: targetKol ? 'pending_approval' : 'open',
      selectedKOLs: targetKol ? [targetKol._id] : [],
      notes: requirements || '',
      brandName: brandName || '',
      isDirectHire: !!targetKol
    });

    console.log(`✅ Campaign "${campaignName}" created: ${campaign._id}`);

    if (targetKol) {
      console.log("🔍 DEBUG: targetKol exists, creating notification...");
      console.log("🔍 DEBUG: Notification data:", {
        recipient: targetKol._id,
        sender: senderId,
        type: 'campaign_invite',
        campaignId: campaign._id
      });

      try {
        const notif = await Notification.create({
          recipient: targetKol._id,
          sender: senderId,
          type: 'campaign_invite',
          message: `wants to hire you for campaign "${campaignName}"`,
          campaign: campaign._id,
          data: {
            campaignId: campaign._id.toString(),
            campaignName: campaignName,
            budget: budgetMax,
            deadline: deadline
          },
          isRead: false
        });

        console.log(`✅ Notification created: ${notif._id}`);
        console.log(`📧 Notification sent to ${targetKol.username}`);
      } catch (notifErr) {
        console.error(`❌ ERROR creating notification:`, notifErr);
        console.error(`❌ Error details:`, notifErr.message);
      }
    } else {
      console.log("🔍 DEBUG: No targetKol, skipping notification");
    }

    const sender = await User.findById(senderId).select('username fullname');

    return NextResponse.json({
      success: true,
      message: targetKol 
        ? `Campaign request sent to @${targetKol.username}! Please wait for their reply.`
        : "Campaign created successfully!",
      campaign: {
        _id: campaign._id,
        title: campaign.title,
        status: campaign.status,
        targetKol: targetKol ? {
          _id: targetKol._id,
          username: targetKol.username,
          fullname: targetKol.fullname
        } : null
      }
    }, { status: 201 });

  } catch (err) {
    console.error("❌ API ERROR POST /campaign/hire:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

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

    const campaigns = await Campaign.find({ brand: userId })
      .populate('selectedKOLs', 'username fullname profilePhoto')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      campaigns
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR GET /campaign/hire:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}