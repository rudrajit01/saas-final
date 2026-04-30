// app/api/me/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    
    // Firebase সেশন কুকি (Google OAuth)
    const sessionCookie = cookieStore.get("session")?.value;
    // JWT টোকেন কুকি (ইমেইল/পাসওয়ার্ড)
    const tokenCookie = cookieStore.get("token")?.value;

    // ১. Firebase সেশন চেক
    if (sessionCookie) {
      try {
        const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
        const firebaseUid = decoded.uid;

        await connectDB();
        const user = await User.findOne({ firebaseUid }).select("-password");

        if (user) {
          return NextResponse.json(
            {
              user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                firebaseUid: user.firebaseUid,
              },
            },
            { status: 200 }
          );
        }
      } catch (firebaseError) {
        // Firebase ব্যর্থ হলে JWT ট্রাই করবে
      }
    }

    // ২. JWT টোকেন চেক (ইমেইল/পাসওয়ার্ড)
    if (tokenCookie) {
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        console.error("JWT_SECRET environment variable missing");
        return NextResponse.json(
          { message: "Server configuration error" },
          { status: 500 }
        );
      }

      try {
        const decoded = jwt.verify(tokenCookie, JWT_SECRET);
        // নিশ্চিত করা যে decoded অবজেক্ট এবং userId আছে
        if (typeof decoded === "string" || !decoded || typeof decoded.userId !== "string") {
          return NextResponse.json(
            { message: "Invalid token payload" },
            { status: 401 }
          );
        }

        const userId = decoded.userId;
        await connectDB();
        const user = await User.findById(userId).select("-password");

        if (user) {
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
        }
      } catch (jwtError) {
        // টোকেন অবৈধ বা মেয়াদোত্তীর্ণ – কিছু করবেন না, পরে 401 দিবে
      }
    }

    // কোনো বৈধ সেশন নেই
    return NextResponse.json(
      { message: "Not authenticated" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json(
      { message: "Invalid or expired session" },
      { status: 401 }
    );
  }
}
