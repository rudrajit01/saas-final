import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectDB from "@/utils/db";
import User from "@/models/User";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, secret);

    await connectDB();

    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}