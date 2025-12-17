import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "Invalid" }, { status: 401 });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return NextResponse.json({ error: "Invalid" }, { status: 401 });

  const token = signToken({ id: user._id, email });

  return NextResponse.json({ token, name: user.name });
}
