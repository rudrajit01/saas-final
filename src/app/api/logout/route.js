import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST() {
  try {
    const sessionCookie = (await cookies()).get("session")?.value;
    const response = NextResponse.json({ message: "Logout successful" });

    // সেশন কুকি ডিলিট
    response.cookies.set("session", "", { maxAge: 0, path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production" });

    // যদি সেশন কুকি থাকে, তা থেকে uid বের করে রিফ্রেশ টোকেন রিভোক
    if (sessionCookie) {
      try {
        const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
        await adminAuth.revokeRefreshTokens(decoded.uid);
      } catch (err) {
        console.error("Token revoke failed:", err);
      }
    }

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}