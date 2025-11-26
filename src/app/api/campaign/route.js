import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import User from "@/models/User";
import Work from "@/models/Work";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";

// POST - Create new campaign (Brand hires KOL)
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

    const brandUserId = decoded.userId;
    const body = await request.json();

    console.log('📦 Campaign request body:', body);

    const {
      campaignName,
      brandCompany,
      industry,
      description,
      targetAudience,
      budgetRange,
      startDate,
      deadline,
      contentTypes,
      requirements,
      targetKolId,
      targetKolUsername
    } = body;

    if (!campaignName || !description) {
      return NextResponse.json(
        { success: false, message: "Campaign name and description are required" },
        { status: 400 }
      );
    }

    // Parse budget
    let budgetMin = 0;
    let budgetMax = 0;
    if (budgetRange) {
      const numbers = budgetRange.match(/\d+/g);
      if (numbers) {
        budgetMin = parseInt(numbers[0]) || 0;
        budgetMax = parseInt(numbers[1]) || budgetMin;
      }
    }

    // Convert content types to deliverables
    const deliverables = [];
    const contentTypeMap = {
      'ig_feeds': { type: 'ig_post', title: 'Instagram Feed Post' },
      'ig_reels': { type: 'ig_reel', title: 'Instagram Reel' },
      'ig_story': { type: 'ig_story', title: 'Instagram Story' },
      'tiktok': { type: 'tiktok', title: 'TikTok Video' },
      'youtube': { type: 'youtube', title: 'YouTube Video' },
      'twitter': { type: 'twitter', title: 'Twitter/X Post' }
    };

    if (contentTypes && Array.isArray(contentTypes)) {
      contentTypes.forEach(ct => {
        if (contentTypeMap[ct]) {
          deliverables.push({
            type: contentTypeMap[ct].type,
            title: contentTypeMap[ct].title,
            count: 1
          });
        }
      });
    }

    // Create campaign
    const campaign = await Campaign.create({
      brand: brandUserId,
      title: campaignName,
      description,
      brandCompany: brandCompany || '',
      category: industry?.toLowerCase() || 'other',
      budget: { min: budgetMin, max: budgetMax },
      requirements: deliverables.map(d => ({
        type: d.type,
        count: d.count,
        description: d.title
      })),
      targetAudience: { description: targetAudience || '' },
      deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applicationDeadline: startDate ? new Date(startDate) : new Date(),
      status: targetKolId || targetKolUsername ? 'in_progress' : 'open',
      notes: requirements || '',
      tags: industry ? [industry.toLowerCase()] : []
    });

    console.log(`✅ Campaign created: ${campaign._id}`);

    // If targeting specific KOL
    if (targetKolId || targetKolUsername) {
      let kolUser;
      
      if (targetKolId) {
        kolUser = await User.findById(targetKolId);
      } else if (targetKolUsername) {
        kolUser = await User.findOne({ username: targetKolUsername });
      }

      if (kolUser) {
        console.log(`🎯 Found KOL: ${kolUser.username} (${kolUser._id})`);

        // Create Work for the KOL
        const work = await Work.create({
          kol: kolUser._id,
          campaign: campaign._id,
          brand: brandUserId,
          title: campaignName,
          description,
          status: 'pending',
          progress: 0,
          budget: budgetMax || budgetMin,
          earnings: 0,
          deliverables: deliverables.map(d => ({
            type: d.type,
            title: d.title,
            required: d.count || 1,
            submitted: 0,
            submissions: []
          })),
          deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          engagementTarget: 0,
          notes: requirements || ''
        });

        console.log(`✅ Work created: ${work._id}`);

        // Add KOL to campaign's selected list
        campaign.selectedKOLs = campaign.selectedKOLs || [];
        campaign.selectedKOLs.push(kolUser._id);
        await campaign.save();

        // Get brand info for notification
        const brandUser = await User.findById(brandUserId).select('username fullname companyName profilePhoto');

        // 🔔 CREATE NOTIFICATION FOR KOL
        const notification = await Notification.create({
          recipient: kolUser._id,  // ← PAKE recipient BUKAN user!
          sender: brandUserId,
          type: 'campaign_invite',
          message: `wants to hire you for "${campaignName}"`,
          campaign: campaign._id,
          work: work._id,
          data: {
            campaignId: campaign._id.toString(),
            workId: work._id.toString(),
            campaignName,
            budget: budgetMax || budgetMin,
            deadline: deadline,
            brandName: brandUser?.companyName || brandUser?.fullname || brandUser?.username
          }
        });

        console.log(`✅ Notification created: ${notification._id} for KOL ${kolUser.username}`);

        return NextResponse.json({
          success: true,
          message: "Campaign sent to KOL!",
          campaign: { _id: campaign._id, title: campaign.title },
          work: { _id: work._id, status: work.status },
          notification: { _id: notification._id },
          sentToKol: { _id: kolUser._id, username: kolUser.username }
        }, { status: 201 });
      } else {
        console.log('❌ KOL not found:', targetKolUsername || targetKolId);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Campaign created!",
      campaign: { _id: campaign._id, title: campaign.title }
    }, { status: 201 });

  } catch (err) {
    console.error("❌ API ERROR POST /campaigns:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// GET - Get campaigns
export async function GET(request) {
  try {
    await dbConnect();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let campaigns;
    if (type === 'my') {
      campaigns = await Campaign.find({ brand: userId })
        .populate('selectedKOLs', 'username fullname profilePhoto')
        .sort({ createdAt: -1 })
        .lean();
    } else {
      campaigns = await Campaign.find({ 
        status: 'open',
        applicationDeadline: { $gte: new Date() }
      })
        .populate('brand', 'username fullname profilePhoto companyName')
        .sort({ createdAt: -1 })
        .lean();
    }

    return NextResponse.json({ success: true, campaigns }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR GET /campaigns:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}