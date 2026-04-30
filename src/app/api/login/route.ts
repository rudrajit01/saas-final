import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import connectDB from "@/utils/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ message: "Valid idToken required" }, { status: 400 });
    }

    // ফায়ারবেস আইডি টোকেন ভেরিফাই
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const email = decoded.email ?? "";          // undefined হলে ফাঁকা স্ট্রিং
    const name = decoded.name ?? email.split("@")[0]; 

    await connectDB();

    // মঙ্গোডিবিতে ইউজার সিঙ্ক (firebaseUid ফিল্ড থাকা চাই)
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email: email,
        name: name,
      });
    }

    // সেশন কুকি তৈরি (৫ দিন)
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    return response;
  } catch (error: unknown) {
    console.error("Login error:", error);
    const message = error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json({ message }, { status: 401 });
  }
}