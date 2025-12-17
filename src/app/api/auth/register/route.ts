import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  await connectDB();

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed });

  return NextResponse.json({ message: "User registered" });
}
