import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // 🔗 Koneksi ke MongoDB
    await dbConnect();

    // 🧾 Ambil body dari request
    const body = await req.json();
    const { email, password, username, fullname } = body;

    // 🧩 Validasi input
    if (!email || !password || !username || !fullname) {
      return new Response(
        JSON.stringify({ message: "Semua field wajib diisi." }),
        { status: 400 }
      );
    }

    // ✉️ Cek apakah email atau username sudah terdaftar
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return new Response(
        JSON.stringify({ message: "Email atau username sudah digunakan." }),
        { status: 409 }
      );
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 Simpan user baru dengan role "company"
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      fullname,
      role: "company",
    });

    // ✅ Respon sukses
    return new Response(
      JSON.stringify({
        message: "Company berhasil didaftarkan.",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          fullname: user.fullname,
          role: user.role,
        },
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Register company error:", err.errors || err);

    // Jika error dari validasi Mongoose
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return new Response(
        JSON.stringify({ message: "Validasi gagal.", errors: messages }),
        { status: 400 }
      );
    }

    // Jika error lainnya (server)
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: err.message,
      }),
      { status: 500 }
    );
  }
}
