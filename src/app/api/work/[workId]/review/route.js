import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Work from "@/models/Work";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";

// PUT - Brand approve/reject submission
export async function PUT(request, { params }) {
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

    const { deliverableIndex, submissionIndex, action, feedback } = body;
    // action: 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action. Use 'approve' or 'reject'" },
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

    // Verify Brand owns this work
    if (work.brand.toString() !== decoded.userId) {
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

    const submission = deliverable.submissions[submissionIndex];
    if (!submission) {
      return NextResponse.json(
        { success: false, message: "Submission not found" },
        { status: 404 }
      );
    }

    // Update submission status
    submission.status = action === 'approve' ? 'approved' : 'rejected';
    if (feedback) {
      submission.feedback = feedback;
    }

    // Recalculate submitted count
    deliverable.submitted = deliverable.submissions.filter(s => 
      s.status === 'approved'
    ).length;

    // Calculate overall work progress
    let totalRequired = 0;
    let totalSubmitted = 0;
    work.deliverables.forEach(d => {
      totalRequired += d.required || 0;
      totalSubmitted += d.submitted || 0;
    });
    
    work.progress = totalRequired > 0 ? Math.round((totalSubmitted / totalRequired) * 100) : 0;

    // Update work status if all deliverables are approved
    const allApproved = work.deliverables.every(d => d.submitted >= d.required);
    if (allApproved && work.status === 'in_review') {
      work.status = 'completed';
    }

    await work.save();

    // Notify KOL
    const message = action === 'approve' 
      ? `approved your submission for "${deliverable.type}"`
      : `requested revisions for "${deliverable.type}"`;

    await Notification.create({
      recipient: work.kol,
      sender: decoded.userId,
      type: action === 'approve' ? 'submission_approved' : 'submission_rejected',
      message,
      data: {
        workId: work._id,
        deliverableIndex,
        submissionIndex,
        feedback
      },
      isRead: false
    });

    console.log(`✅ Brand ${decoded.userId} ${action}ed submission for work ${workId}`);

    return NextResponse.json({
      success: true,
      message: `Submission ${action}ed`,
      deliverable: {
        type: deliverable.type,
        submitted: deliverable.submitted,
        required: deliverable.required,
        submissions: deliverable.submissions
      },
      workProgress: work.progress
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR PUT /work/[workId]/review:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}