// app/api/me/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    
    const sessionCookie = cookieStore.get("session")?.value;
    const tokenCookie = cookieStore.get("token")?.value;

    // 1️⃣ Firebase সেশন কুকি চেক করুন (Google OAuth)
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
        // Firebase সেশন ব্যর্থ হলে JWT ট্রাই করবে
      }
    }

    // 2️⃣ JWT টোকেন চেক করুন (ইমেইল/পাসওয়ার্ড লগইন)
    if (tokenCookie) {
      // 🔑 এনভায়রনমেন্ট ভেরিয়েবল চেক – এটাই ফিক্স
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        console.error("JWT_SECRET environment variable is missing");
        return NextResponse.json(
          { message: "Server configuration error" },
          { status: 500 }
        );
      }

      try {
        const decoded = jwt.verify(tokenCookie, JWT_SECRET) as { userId: string };
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
        // টোকেন অবৈধ বা মেয়াদউত্তীর্ণ
      }
    }

    // কোনো সেশনই বৈধ নয়
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
