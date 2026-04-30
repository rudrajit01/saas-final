import { NextResponse } from "next/server";
import connectDB from "@/utils/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ success: true, message: "DB connected" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}