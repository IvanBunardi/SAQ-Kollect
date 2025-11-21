import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import User from "@/models/User";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";

// POST - Create a hire request/campaign
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

    const {
      targetKolId,        // KOL yang mau di-hire (optional, bisa general campaign)
      targetKolUsername,  // atau pakai username
      campaignName,
      brandName,
      industry,
      description,
      targetAudience,
      budgetRange,
      startDate,
      deadline,
      contentTypes,       // ['ig_feed', 'ig_reel', 'ig_story', 'tiktok', 'youtube', 'twitter']
      requirements
    } = body;

    // Validate required fields
    if (!campaignName || !description) {
      return NextResponse.json(
        { success: false, message: "Campaign name and description are required" },
        { status: 400 }
      );
    }

    // Find target KOL if specified
    let targetKol = null;
    if (targetKolId) {
      targetKol = await User.findById(targetKolId);
    } else if (targetKolUsername) {
      targetKol = await User.findOne({ username: targetKolUsername });
    }

    // Parse budget
    let budgetMin = 0;
    let budgetMax = 0;
    if (budgetRange) {
      const budgetParts = budgetRange.replace(/[^0-9-]/g, '').split('-');
      budgetMin = parseInt(budgetParts[0]) || 0;
      budgetMax = parseInt(budgetParts[1]) || budgetMin;
    }

    // Convert content types to requirements format
    const deliverables = [];
    if (contentTypes && Array.isArray(contentTypes)) {
      contentTypes.forEach(type => {
        let deliverableType = type;
        // Map frontend values to backend enum
        if (type === 'ig_feed' || type === 'IG Feeds') deliverableType = 'ig_post';
        if (type === 'ig_reel' || type === 'IG Reels') deliverableType = 'ig_reel';
        if (type === 'ig_story' || type === 'IG Story') deliverableType = 'ig_story';
        if (type === 'tiktok' || type === 'TikTok') deliverableType = 'tiktok';
        if (type === 'youtube' || type === 'YouTube') deliverableType = 'youtube';
        if (type === 'twitter' || type === 'X (Twitter)') deliverableType = 'twitter';
        
        deliverables.push({
          type: deliverableType,
          count: 1,
          description: ''
        });
      });
    }

    // Create campaign
    const campaign = await Campaign.create({
      brand: senderId,
      title: campaignName,
      description: description,
      category: industry?.toLowerCase() || 'other',
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

    // If targeting specific KOL, send notification
    if (targetKol) {
      await Notification.create({
        recipient: targetKol._id,
        sender: senderId,
        type: 'campaign_invite',
        message: `wants to hire you for campaign "${campaignName}"`,
        data: {
          campaignId: campaign._id,
          campaignName: campaignName,
          budget: budgetMax,
          deadline: deadline
        },
        isRead: false
      });

      console.log(`📧 Campaign invite sent to ${targetKol.username}`);
    }

    // Get sender info for response
    const sender = await User.findById(senderId).select('username fullname');

    console.log(`✅ Campaign "${campaignName}" created by ${sender.username}`);

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

// GET - Get campaigns created by current user (brand)
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