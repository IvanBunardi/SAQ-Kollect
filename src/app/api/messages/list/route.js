import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message"; // Digunakan untuk mencari kontak unik
import User from "@/models/User"; // Digunakan untuk mendapatkan detail pengguna
import jwt from "jsonwebtoken";

// Data simulasi untuk fallback (Ganti dengan skema User Mongoose Anda)
const MOCK_USER_DATA = [
    { id: "felix", name: "Felix Tan", category: "Tech", followers: "143K Followers", profilePhoto: "/assets/fotomes.png" },
];


export async function GET(request) {
    await dbConnect();

    const auth = request.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });

    try {
        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const myId = decoded.userId; // ID pengguna yang sedang login

        // --- Logika Mendapatkan Daftar Kontak Unik (Versi Sederhana) ---
        // Anda harus mengambil daftar ID unik dari pesan yang pernah Anda kirim/terima
        // Kemudian, cari detail profil mereka di koleksi User.
        
        // Karena ini adalah contoh dan saya tidak memiliki model User/Message Anda:
        // Kami mengembalikan data dummy agar tampilan depan berfungsi.
        
        // Di aplikasi nyata, Anda akan melakukan Query Mongoose yang kompleks di sini.
        
        // Contoh: Ambil semua pesan yang melibatkan myId
        /*
        const conversations = await Message.find({
            $or: [{ sender: myId }, { receiver: myId }]
        }).select('sender receiver');

        const uniqueUserIds = new Set();
        conversations.forEach(msg => {
            if (msg.sender.toString() !== myId) uniqueUserIds.add(msg.sender.toString());
            if (msg.receiver.toString() !== myId) uniqueUserIds.add(msg.receiver.toString());
        });
        
        const contacts = await User.find({ _id: { $in: Array.from(uniqueUserIds) } });
        const chatList = contacts.map(user => ({
            id: user._id.toString(),
            name: user.username, // Ganti dengan nama field pengguna Anda
            category: user.category || 'Creator',
            followers: user.followersCount ? `${user.followersCount} Followers` : 'New User',
        }));
        */

        // Mengembalikan MOCK data yang terlihat seperti array (untuk menghindari error frontend)
        return NextResponse.json(MOCK_USER_DATA, { status: 200 });

    } catch (error) {
        console.error("JWT or DB error in /list:", error);
        // Tangani error JWT (401 Unauthorized)
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}