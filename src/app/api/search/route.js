import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    // Jika query kosong → langsung return kosong
    if (q.trim() === "") {
      return Response.json({ users: [] });
    }

    // Regex for case-insensitive search
    const regex = new RegExp(q, "i");

    // Cari berdasarkan fullname atau username
    const users = await User.find(
      {
        $or: [
          { fullname: { $regex: regex } },
          { username: { $regex: regex } }
        ]
      },
      {
        password: 0, // jangan tampilkan password
        email: 0     // optional: hide email juga
      }
    ).limit(20);

    return Response.json({ users });
  } catch (error) {
    console.error("Search API error:", error);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}