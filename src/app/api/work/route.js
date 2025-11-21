import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Work from "@/models/work";
import jwt from "jsonwebtoken";

// GET - Get all works for logged-in KOL
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

    // Get filter from query
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'all', 'active', 'completed', etc.

    let query = { kol: userId };
    
    if (status && status !== 'all') {
      if (status === 'active') {
        query.status = { $in: ['pending', 'active', 'in_review', 'revision'] };
      } else {
        query.status = status;
      }
    }

    const works = await Work.find(query)
      .populate('brand', 'username fullname profilePhoto companyName')
      .populate('campaign', 'title category coverImage')
      .sort({ createdAt: -1 })
      .lean();

    // Format response
    const formattedWorks = works.map(work => {
      // Calculate progress
      let totalRequired = 0;
      let totalSubmitted = 0;
      
      work.deliverables?.forEach(d => {
        totalRequired += d.required || 0;
        totalSubmitted += Math.min(d.submitted || 0, d.required || 0);
      });
      
      const progress = totalRequired > 0 ? Math.round((totalSubmitted / totalRequired) * 100) : 0;

      return {
        _id: work._id,
        title: work.title,
        description: work.description,
        brand: {
          _id: work.brand._id,
          name: work.brand.companyName || work.brand.fullname || work.brand.username,
          profilePhoto: work.brand.profilePhoto
        },
        campaign: work.campaign,
        status: work.status,
        progress,
        budget: work.budget,
        earnings: work.earnings,
        deadline: work.deadline,
        deliverables: work.deliverables?.map(d => ({
          type: d.type,
          title: d.title,
          required: d.required,
          submitted: d.submitted,
          submissions: d.submissions
        })) || [],
        engagementTarget: work.engagementTarget,
        actualEngagement: work.actualEngagement,
        createdAt: work.createdAt
      };
    });

    return NextResponse.json({
      success: true,
      works: formattedWorks
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR GET /work:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}