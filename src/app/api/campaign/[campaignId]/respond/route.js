import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import Work from "@/src/models/Work";
import User from "@/models/User";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";

// POST - KOL responds to campaign invite (accept/reject)
export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { campaignId } = await params;

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

    const kolId = decoded.userId;
    const { action } = await request.json(); // 'accept' or 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action. Use 'accept' or 'reject'" },
        { status: 400 }
      );
    }

    // Find campaign
    const campaign = await Campaign.findById(campaignId)
      .populate('brand', 'username fullname');

    if (!campaign) {
      return NextResponse.json(
        { success: false, message: "Campaign not found" },
        { status: 404 }
      );
    }

    // Check if KOL is invited
    const isInvited = campaign.selectedKOLs.some(id => id.toString() === kolId);
    if (!isInvited) {
      return NextResponse.json(
        { success: false, message: "You are not invited to this campaign" },
        { status: 403 }
      );
    }

    const kol = await User.findById(kolId).select('username fullname');

    if (action === 'accept') {
      // Update campaign status
      campaign.status = 'in_progress';
      await campaign.save();

      // Create Work record
      const deliverables = campaign.requirements.map(req => ({
        type: req.type,
        title: req.description || '',
        required: req.count || 1,
        submitted: 0,
        submissions: []
      }));

      const work = await Work.create({
        kol: kolId,
        campaign: campaign._id,
        brand: campaign.brand._id,
        title: campaign.title,
        description: campaign.description,
        status: 'active',
        progress: 0,
        budget: campaign.budget.max,
        earnings: campaign.budget.max,
        deliverables: deliverables,
        deadline: campaign.deadline,
        engagementTarget: 0,
        notes: campaign.notes || ''
      });

      // Notify brand
      await Notification.create({
        recipient: campaign.brand._id,
        sender: kolId,
        type: 'campaign_accepted',
        message: `accepted your campaign "${campaign.title}"`,
        data: {
          campaignId: campaign._id,
          workId: work._id
        },
        isRead: false
      });

      console.log(`✅ ${kol.username} accepted campaign "${campaign.title}"`);

      return NextResponse.json({
        success: true,
        message: "Campaign accepted! Check your Work page for details.",
        work: {
          _id: work._id,
          title: work.title,
          status: work.status
        }
      }, { status: 200 });

    } else {
      // Reject
      campaign.status = 'rejected';
      campaign.selectedKOLs = campaign.selectedKOLs.filter(id => id.toString() !== kolId);
      await campaign.save();

      // Notify brand
      await Notification.create({
        recipient: campaign.brand._id,
        sender: kolId,
        type: 'campaign_rejected',
        message: `declined your campaign "${campaign.title}"`,
        data: {
          campaignId: campaign._id
        },
        isRead: false
      });

      console.log(`❌ ${kol.username} rejected campaign "${campaign.title}"`);

      return NextResponse.json({
        success: true,
        message: "Campaign declined."
      }, { status: 200 });
    }

  } catch (err) {
    console.error("❌ API ERROR POST /campaign/[campaignId]/respond:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}