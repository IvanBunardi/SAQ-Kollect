import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";

// ✅ SAVE POST
export async function POST(request, { params }) {
  try {
    await dbConnect();

    // ✅ FIX: Await params
    const { postId } = await params;

    // Verify token
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

    // Cari post
    const post = await Post.findById(postId);
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Cek apakah sudah di-save
    const alreadySaved = post.saves.includes(userId);

    if (alreadySaved) {
      return NextResponse.json(
        { success: false, message: "Already saved this post" },
        { status: 400 }
      );
    }

    // Tambahkan save
    post.saves.push(userId);
    await post.save();

    console.log(`✅ User ${userId} saved post ${postId}`);

    return NextResponse.json({
      success: true,
      message: "Post saved successfully",
      savesCount: post.saves.length
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR /post/[postId]/save:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// ✅ UNSAVE POST
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    // ✅ FIX: Await params
    const { postId } = await params;

    // Verify token
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

    // Cari post
    const post = await Post.findById(postId);
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Hapus save
    post.saves = post.saves.filter(id => id.toString() !== userId.toString());
    await post.save();

    console.log(`✅ User ${userId} unsaved post ${postId}`);

    return NextResponse.json({
      success: true,
      message: "Post unsaved successfully",
      savesCount: post.saves.length
    }, { status: 200 });

  } catch (err) {
    console.error("❌ API ERROR DELETE /post/[postId]/save:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}