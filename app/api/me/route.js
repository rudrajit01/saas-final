// app/api/me/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if (!userCookie) {
      return NextResponse.json(
        { message: "User not logged in" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { user: JSON.parse(userCookie.value) },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid user data" },
      { status: 500 }
    );
  }
}