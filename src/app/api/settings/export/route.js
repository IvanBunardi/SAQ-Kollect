import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import Work from "@/models/Work";
import Campaign from "@/models/Campaign";
import jwt from "jsonwebtoken";

// GET - Get user data for download/export
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

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json'; // json atau csv
    const dataType = searchParams.get('type') || 'all'; // all, profile, posts, works, campaigns

    // Fetch user data
    const user = await User.findById(decoded.userId)
      .select('-password -blockedUsers -followers -following');

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    let exportData = {
      exportDate: new Date(),
      user: {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        bio: user.bio,
        website: user.website,
        profilePhoto: user.profilePhoto,
        createdAt: user.createdAt
      }
    };

    // Get posts
    if (dataType === 'all' || dataType === 'posts') {
      const posts = await Post.find({ author: decoded.userId })
        .select('caption mediaUrl likes comments createdAt');
      exportData.posts = posts;
    }

    // Get works (campaigns done)
    if (dataType === 'all' || dataType === 'works') {
      const works = await Work.find({ kol: decoded.userId })
        .select('title status budget progress deadline')
        .populate('campaign', 'title');
      exportData.works = works;
    }

    // Get campaigns (created by brand)
    if (dataType === 'all' || dataType === 'campaigns') {
      const campaigns = await Campaign.find({ brand: decoded.userId })
        .select('title status budget deadline selectedKOLs');
      exportData.campaigns = campaigns;
    }

    if (format === 'csv') {
      // Convert to CSV
      const csvContent = convertToCSV(exportData);
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="kollect_data_${Date.now()}.csv"`
        }
      });
    } else {
      // JSON format
      return new NextResponse(JSON.stringify(exportData, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="kollect_data_${Date.now()}.json"`
        }
      });
    }

  } catch (err) {
    console.error("❌ API ERROR GET /settings/export:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// Helper function to convert data to CSV
function convertToCSV(data) {
  let csv = 'Kollect Data Export\n';
  csv += `Export Date: ${new Date().toISOString()}\n\n`;

  // User data
  csv += 'USER INFORMATION\n';
  csv += 'Username,Full Name,Email,Bio\n';
  csv += `"${data.user.username}","${data.user.fullname}","${data.user.email}","${data.user.bio}"\n\n`;

  // Posts
  if (data.posts && data.posts.length > 0) {
    csv += 'POSTS\n';
    csv += 'Caption,Likes,Comments,Created Date\n';
    data.posts.forEach(post => {
      csv += `"${post.caption}",${post.likes || 0},${post.comments?.length || 0},"${new Date(post.createdAt).toLocaleDateString()}"\n`;
    });
    csv += '\n';
  }

  // Works
  if (data.works && data.works.length > 0) {
    csv += 'WORKS / CAMPAIGNS DONE\n';
    csv += 'Campaign Title,Status,Budget,Progress,Deadline\n';
    data.works.forEach(work => {
      csv += `"${work.title}","${work.status}","$${work.budget}","${work.progress}%","${new Date(work.deadline).toLocaleDateString()}"\n`;
    });
    csv += '\n';
  }

  // Campaigns
  if (data.campaigns && data.campaigns.length > 0) {
    csv += 'CAMPAIGNS CREATED\n';
    csv += 'Campaign Title,Status,Budget,Deadline,KOLs Selected\n';
    data.campaigns.forEach(campaign => {
      csv += `"${campaign.title}","${campaign.status}","$${campaign.budget}","${new Date(campaign.deadline).toLocaleDateString()}",${campaign.selectedKOLs?.length || 0}\n`;
    });
  }

  return csv;
}