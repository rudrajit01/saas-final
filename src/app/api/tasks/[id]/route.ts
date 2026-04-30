import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Task from "@/models/Task";
import { jwtVerify } from "jose";
import { adminAuth } from '@/lib/firebase-admin';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Helper: Get user ID from either JWT token or Firebase session
async function getUserIdFromRequest(request: NextRequest) {
  // Check for JWT token first (email/password login)
  const jwtToken = request.cookies.get("token")?.value;
  if (jwtToken) {
    try {
      const { payload } = await jwtVerify(jwtToken, secret);
      return payload.userId as string;
    } catch {
      // Continue to check Firebase session
    }
  }

  // Check for Firebase session (Google OAuth)
  const sessionCookie = request.cookies.get("session")?.value;
  if (sessionCookie) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
      return decoded.uid;
    } catch {
      return null;
    }
  }

  return null;
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { completed, title, description } = await request.json();
  await connectDB();
  const task = await Task.findOneAndUpdate(
    { _id: params.id, userId },
    { completed, title, description, updatedAt: new Date() },
    { new: true }
  );
  if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });
  return NextResponse.json(task);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB();
  const task = await Task.findOneAndDelete({ _id: params.id, userId });
  if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
