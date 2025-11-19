import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import jwt from "jsonwebtoken";

export async function POST(request) {
    await dbConnect();

    const auth = request.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });

    try {
        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const myId = decoded.userId; // ID pengguna yang sedang mengirim pesan

        const { to, text } = await request.json();

        if (!to || !text) {
            return NextResponse.json({ error: "Receiver ID and text are required" }, { status: 400 });
        }

        // Buat pesan baru di MongoDB
        const newMessage = await Message.create({
            sender: myId,
            // Penting: pastikan 'to' adalah ObjectID yang valid
            receiver: new mongoose.Types.ObjectId(to), 
            content: text, 
        });

        return NextResponse.json({ message: "Message sent successfully", data: newMessage }, { status: 201 });

    } catch (error) {
        console.error("Error sending message:", error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
             return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}