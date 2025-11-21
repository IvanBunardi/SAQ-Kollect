import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import work from "@/models/work";
import jwt from "jsonwebtoken";

// GET - Get work statistics for KOL dashboard
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

    // Get all works for this KOL
    const allWorks = await Work.find({ kol: userId }).lean();

    // Calculate statistics
    const activeProjects = allWorks.filter(w => 
      ['pending', 'active', 'in_review', 'revision'].includes(w.status)
    ).length;

    const completedProjects = allWorks.filter(w => 
      ['completed', 'paid'].includes(w.status)
    ).length;

    const totalEarnings = allWorks
      .filter(w => w.status === 'paid')
      .reduce((sum, w) => sum + (w.earnings || 0), 0);

    const pendingEarnings = allWorks
      .filter(w => w.status === 'completed')
      .reduce((sum, w) => sum + (w.earnings || 0), 0);

    const totalEngagement = allWorks.reduce((sum, w) => sum + (w.actualEngagement || 0), 0);
    const avgEngagement = allWorks.length > 0 ? Math.round(totalEngagement / allWorks.length) : 0;

    // This month stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const thisMonthWorks = allWorks.filter(w => 
      new Date(w.createdAt) >= startOfMonth
    ).length;

    const thisMonthEarnings = allWorks
      .filter(w => w.paidAt && new Date(w.paidAt) >= startOfMonth)
      .reduce((sum, w) => sum + (w.earnings || 0), 0);

    // Upcoming deadlines (next 7 days)
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingDeadlines = allWorks.filter(w => {
      if (!['active', 'in_review', 'revision'].includes(w.status)) return false;
      const deadline = new Date(w.deadline);
      return deadline >= now && deadline <= nextWeek;
    }).length;

    return NextResponse.json({
      success: true,
      stats: {
        activeProjects,
        completedProjects,
        totalProjects: allWorks.length,
        totalEarnings,
        pendingEarnings,
        avgEngagement,
        thisMonthProjects: thisMonthWorks,
        thisMonthEarnings,
        upcomingDeadlines
      }
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR GET /work/stats:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}