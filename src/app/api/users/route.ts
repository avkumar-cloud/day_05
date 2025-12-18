import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find().select("_id name");
    console.log("users", users)

    return NextResponse.json(users); // ✅ ALWAYS RETURN JSON
  } catch (error) {
    console.error("Users API error:", error);
    return NextResponse.json([], { status: 500 }); // ✅ SAFE FALLBACK
  }
}
