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
    
    // Check for Firebase session cookie first (Google OAuth)
    const sessionCookie = cookieStore.get("session")?.value;
    
    // Check for JWT token cookie (email/password login)
    const tokenCookie = cookieStore.get("token")?.value;

    // Try Firebase session first
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
        // Continue to check JWT token
      }
    }

    // Try JWT token (email/password login)
    if (tokenCookie) {
      try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
          return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });
        }
        
        const decoded = jwt.verify(tokenCookie, JWT_SECRET);
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
        // Token invalid or expired
      }
    }

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
