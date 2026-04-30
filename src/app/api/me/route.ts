import { NextResponse } from "next/server";
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from "@/utils/db";
import User from "@/models/User";

export async function GET() {
  try {
    // Check for Firebase session cookie first (Google OAuth)
    const sessionCookie = (await cookies()).get("session")?.value;
    
    // Check for JWT token (email/password login)
    const jwtToken = (await cookies()).get("token")?.value;

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
    if (jwtToken) {
      const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
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
    }

    return NextResponse.json(
      { message: "No active session" },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Session verification error:", error);
    return NextResponse.json(
      { message: "Invalid or expired session" },
      { status: 401 }
    );
  }
}
