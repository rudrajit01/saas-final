import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Task from "@/models/Task";
import jwt from "jsonwebtoken";
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

// JWT payload interface
interface JwtPayload {
  userId: string;
}

// Helper: Get user ID from either JWT token or Firebase session
async function getUserId(): Promise<{ userId: string; type: 'jwt' | 'firebase' } | null> {
  // Check for JWT token first (email/password login)
  const jwtToken = (await cookies()).get("token")?.value;
  if (jwtToken) {
    try {
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        console.error("JWT_SECRET not configured");
        return null;
      }
      const decoded = jwt.verify(jwtToken, JWT_SECRET) as JwtPayload;
      return { userId: decoded.userId, type: 'jwt' };
    } catch (error) {
      console.error("JWT verification failed:", error);
    }
  }

  // Check for Firebase session (Google OAuth)
  const sessionCookie = (await cookies()).get("session")?.value;
  if (sessionCookie) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
      return { userId: decoded.uid, type: 'firebase' };
    } catch (error) {
      console.error("Session verification failed:", error);
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  const user = await getUserId();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const tasks = await Task.find({ userId: user.userId }).sort({ createdAt: -1 });
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const user = await getUserId();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { title, description } = await request.json();
  if (!title) {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  }
  await connectDB();
  const task = await Task.create({
    title,
    description: description || "",
    userId: user.userId,
    completed: false,
  });
  return NextResponse.json(task, { status: 201 });
}
