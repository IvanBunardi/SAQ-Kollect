import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Work from "@/models/Work";
import jwt from "jsonwebtoken";

// POST - Submit deliverable
export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { workId } = await params;
    const body = await request.json();

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

    const { deliverableIndex, url, caption } = body;

    if (deliverableIndex === undefined || !url) {
      return NextResponse.json(
        { success: false, message: "deliverableIndex and url are required" },
        { status: 400 }
      );
    }

    const work = await Work.findById(workId);

    if (!work) {
      return NextResponse.json(
        { success: false, message: "Work not found" },
        { status: 404 }
      );
    }

    // Verify KOL owns this work
    if (work.kol.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    // Get deliverable
    const deliverable = work.deliverables[deliverableIndex];
    if (!deliverable) {
      return NextResponse.json(
        { success: false, message: "Deliverable not found" },
        { status: 404 }
      );
    }

    // Add submission
    const submission = {
      url,
      caption: caption || '',
      submittedAt: new Date(),
      status: 'pending',
      feedback: ''
    };

    if (!deliverable.submissions) {
      deliverable.submissions = [];
    }

    deliverable.submissions.push(submission);
    deliverable.submitted = (deliverable.submissions.filter(s => 
      ['pending', 'approved'].includes(s.status)
    ).length);

    // Update work status to "in_review" if it was "active"
    if (work.status === 'active') {
      work.status = 'in_review';
    }

    await work.save();

    console.log(`✅ KOL ${decoded.userId} submitted deliverable ${deliverableIndex} for work ${workId}`);

    return NextResponse.json({
      success: true,
      message: "Deliverable submitted successfully",
      deliverable: {
        type: deliverable.type,
        title: deliverable.title,
        submitted: deliverable.submitted,
        required: deliverable.required,
        submissions: deliverable.submissions
      }
    }, { status: 201 });

  } catch (err) {
    console.error("❌ API ERROR POST /work/[workId]/submit:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// GET - Get submissions for a deliverable
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { workId } = await params;
    const { searchParams } = new URL(request.url);
    const deliverableIndex = searchParams.get('deliverableIndex');

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

    const work = await Work.findById(workId)
      .populate('kol', 'username fullname')
      .populate('brand', 'username fullname');

    if (!work) {
      return NextResponse.json(
        { success: false, message: "Work not found" },
        { status: 404 }
      );
    }

    // Check authorization (KOL or Brand)
    if (work.kol._id.toString() !== decoded.userId && 
        work.brand._id.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    const deliverable = work.deliverables[deliverableIndex];
    if (!deliverable) {
      return NextResponse.json(
        { success: false, message: "Deliverable not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      submissions: deliverable.submissions || []
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR GET /work/[workId]/submit:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}