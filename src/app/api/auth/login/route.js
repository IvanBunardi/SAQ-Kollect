import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email dan password wajib diisi." }),
        { status: 400 }
      );
    }

    // Cek apakah user ada
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Email tidak terdaftar." }),
        { status: 404 }
      );
    }

    // Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: "Password salah." }),
        { status: 401 }
      );
    }

    // Login sukses
    return new Response(
      JSON.stringify({
        message: "Login berhasil.",
        user: {
          id: user._id,
          email: user.email,
          fullname: user.fullname,
          username: user.username,
          role: user.role,
        },
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return new Response(
      JSON.stringify({
        message: "Terjadi kesalahan di server.",
        error: err.message,
      }),
      { status: 500 }
    );
  }
}
