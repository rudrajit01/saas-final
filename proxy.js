import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyAuthToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const isDashboardPage = pathname.startsWith("/dashboard");

  const payload = token ? await verifyAuthToken(token) : null;
  const isAuthenticated = !!payload;

  if (isDashboardPage && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const requestHeaders = new Headers(request.headers);

  if (payload) {
    requestHeaders.set("x-user-id", String(payload.id || ""));
    requestHeaders.set("x-user-email", String(payload.email || ""));
    requestHeaders.set("x-user-name", String(payload.name || ""));
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (token && !payload) {
    response.cookies.delete("token");
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};