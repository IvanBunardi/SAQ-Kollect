import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Work from "@/models/Work";
import jwt from "jsonwebtoken";

// POST - Submit deliverable
export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { workId } = await params;
    const { deliverableIndex, url, mediaUrl, caption } = await request.json();

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

    const work = await Work.findById(workId);

    if (!work) {
      return NextResponse.json(
        { success: false, message: "Work not found" },
        { status: 404 }
      );
    }

    // Only KOL can submit
    if (work.kol.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    // Check deliverable exists
    if (deliverableIndex < 0 || deliverableIndex >= work.deliverables.length) {
      return NextResponse.json(
        { success: false, message: "Invalid deliverable index" },
        { status: 400 }
      );
    }

    const deliverable = work.deliverables[deliverableIndex];

    // Check if already met requirement
    if (deliverable.submitted >= deliverable.required) {
      return NextResponse.json(
        { success: false, message: "Already submitted all required deliverables" },
        { status: 400 }
      );
    }

    // Add submission
    deliverable.submissions.push({
      url: url || '',
      mediaUrl: mediaUrl || '',
      caption: caption || '',
      submittedAt: new Date(),
      status: 'pending'
    });

    deliverable.submitted += 1;

    // Recalculate progress
    let totalRequired = 0;
    let totalSubmitted = 0;
    
    work.deliverables.forEach(d => {
      totalRequired += d.required;
      totalSubmitted += Math.min(d.submitted, d.required);
    });
    
    work.progress = totalRequired > 0 ? Math.round((totalSubmitted / totalRequired) * 100) : 0;

    // Update status if all submitted
    if (work.progress >= 100) {
      work.status = 'in_review';
    } else if (work.status === 'pending') {
      work.status = 'active';
    }

    await work.save();

    console.log(`✅ Deliverable submitted for work ${workId}`);

    return NextResponse.json({
      success: true,
      message: "Deliverable submitted successfully",
      work: {
        _id: work._id,
        progress: work.progress,
        status: work.status,
        deliverables: work.deliverables
      }
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR POST /work/[workId]/submit:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}