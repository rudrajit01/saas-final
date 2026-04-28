import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { extractToken, verifyUserToken } from "@/lib/auth";
import Task from "@/models/Task";

export async function GET(req) {
  try {
    const token = extractToken(req);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyUserToken(token);

    await connectDB();

    const tasks = await Task.find({ userId: decoded.userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch tasks", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const token = extractToken(req);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyUserToken(token);
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const newTask = await Task.create({
      title,
      completed: false,
      userId: decoded.userId,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create task", error: error.message },
      { status: 500 }
    );
  }
}