import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Messages from "@/models/Messages";

export async function GET(request, context) {
    try {
        await dbConnect();

        // FIX PENTING: params HARUS di-await
        const { userId } = await context.params;

        if (!userId) {
            return NextResponse.json(
                { error: "User ID missing" },
                { status: 400 }
            );
        }

        const auth = request.headers.get("authorization");
        if (!auth) {
            return NextResponse.json({ error: "No token" }, { status: 401 });
        }

        const messages = await Messages.find({ to: userId }).lean();

        return NextResponse.json(messages, { status: 200 });

    } catch (err) {
        console.error("API ERROR /messages/[userId]:", err);
        return NextResponse.json(
            { error: "Server error", detail: err.message },
            { status: 500 }
        );
    }
}