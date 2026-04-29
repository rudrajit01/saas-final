import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { id: 1, title: "Sample task 1", completed: false },
    { id: 2, title: "Sample task 2", completed: true },
  ]);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  return NextResponse.json({
    id: Date.now(),
    title: body?.title || "Untitled task",
    completed: false,
  }, { status: 201 });
}

