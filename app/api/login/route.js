import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import { adminAuth } from "@/lib/firebase-admin";
import User from "@/models/User";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, idToken } = body;

    // Handle Google OAuth with idToken
    if (idToken) {
      try {
        const decoded = await adminAuth.verifyIdToken(idToken);
        const uid = decoded.uid;
        const userEmail = decoded.email ?? "";
        const name = decoded.name ?? userEmail.split("@")[0];

        await connectDB();

        // Find or create user with firebaseUid
        let user = await User.findOne({ firebaseUid: uid });
        if (!user) {
          user = await User.create({
            firebaseUid: uid,
            email: userEmail,
            name: name,
          });
        }

        // Create session cookie (5 days)
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

        const response = NextResponse.json(
          {
            success: true,
            user: {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
            },
          },
          { status: 200 }
        );

        response.cookies.set("session", sessionCookie, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: expiresIn / 1000,
        });

        return response;
      } catch (firebaseError) {
        console.error("Firebase verification error:", firebaseError);
        return NextResponse.json(
          { message: "Invalid Google token" },
          { status: 401 }
        );
      }
    }

    // Handle email/password login
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Handle users without password (Firebase OAuth users)
    if (!user.password) {
      return NextResponse.json(
        { message: "Please login with Google" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { message: "Login failed", error: error.message },
      { status: 500 }
    );
  }
}
