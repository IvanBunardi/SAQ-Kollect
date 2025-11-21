import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Work from "@/models/Work";
import jwt from "jsonwebtoken";

// GET - Get single work detail
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { workId } = await params;

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
      .populate('brand', 'username fullname profilePhoto companyName email')
      .populate('campaign', 'title description category coverImage requirements')
      .populate('kol', 'username fullname profilePhoto')
      .lean();

    if (!work) {
      return NextResponse.json(
        { success: false, message: "Work not found" },
        { status: 404 }
      );
    }

    // Check authorization (only KOL or Brand can view)
    if (work.kol._id.toString() !== decoded.userId && 
        work.brand._id.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      work
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR GET /work/[workId]:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// PUT - Update work (status, notes, etc)
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

    const work = await Work.findById(workId);

    if (!work) {
      return NextResponse.json(
        { success: false, message: "Work not found" },
        { status: 404 }
      );
    }

    // Only KOL can update their own work
    if (work.kol.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    // Update allowed fields
    if (body.notes !== undefined) work.notes = body.notes;
    if (body.actualEngagement !== undefined) work.actualEngagement = body.actualEngagement;

    await work.save();

    return NextResponse.json({
      success: true,
      message: "Work updated",
      work
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR PUT /work/[workId]:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}