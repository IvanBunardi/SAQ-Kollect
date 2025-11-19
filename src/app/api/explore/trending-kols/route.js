import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    await dbConnect();

    // Get users with role 'kol'
    const trendingKols = await User.find({ 
      role: "kol",
      isActive: true 
    })
      .select("fullname username profilePhoto category _id")
      .sort({ createdAt: -1 })
      .limit(8);

    console.log('🔍 Raw KOLs from DB:', JSON.stringify(trendingKols, null, 2));

    const formattedKols = trendingKols.map(kol => {
      const formatted = {
        id: kol._id.toString(),
        name: kol.fullname || kol.username, // Gunakan fullname, fallback ke username
        username: kol.username,
        category: kol.category || "Tech",
        profilePhoto: kol.profilePhoto || null,
      };
      console.log('📦 Formatted KOL:', formatted);
      return formatted;
    });

    return NextResponse.json({
      success: true,
      kols: formattedKols,
      total: formattedKols.length
    });

  } catch (error) {
    console.error("❌ Trending KOLs API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}