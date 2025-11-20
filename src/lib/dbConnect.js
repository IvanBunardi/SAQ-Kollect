import mongoose from "mongoose";

let isConnected = false;

export default async function dbConnect() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("❌ Missing MONGODB_URI in .env");

  try {
    const db = await mongoose.connect(uri);
    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}