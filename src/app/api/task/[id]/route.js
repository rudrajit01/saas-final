import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { extractToken, verifyUserToken } from "@/lib/auth";
import Task from "@/models/Task";

export async function PATCH(req, { params }) {
  try {
    const token = extractToken(req);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyUserToken(token);
    const { id } = params;
    const body = await req.json();

    await connectDB();

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      body,
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update task", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = extractToken(req);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyUserToken(token);
    const { id } = params;

    await connectDB();

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      userId: decoded.userId,
    });

    if (!deletedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete task", error: error.message },
      { status: 500 }
    );
  }
}