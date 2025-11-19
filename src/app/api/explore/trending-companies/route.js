import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    await dbConnect();

    // Get users with role 'brand' or 'company'
    const trendingCompanies = await User.find({ 
      role: { $in: ["brand", "company"] },
      isActive: true 
    })
      .select("fullname username profilePhoto category _id")
      .sort({ createdAt: -1 })
      .limit(8);

    console.log('🔍 Raw Companies from DB:', JSON.stringify(trendingCompanies, null, 2));

    const formattedCompanies = trendingCompanies.map(company => {
      const formatted = {
        id: company._id.toString(),
        name: company.fullname || company.username, // Gunakan fullname, fallback ke username
        username: company.username,
        category: company.category || "Tech",
        profilePhoto: company.profilePhoto || null,
      };
      console.log('📦 Formatted Company:', formatted);
      return formatted;
    });

    return NextResponse.json({
      success: true,
      companies: formattedCompanies,
      total: formattedCompanies.length
    });

  } catch (error) {
    console.error("❌ Trending Companies API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
