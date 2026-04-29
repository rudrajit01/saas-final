import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function generateUserToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyUserToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function extractToken(req) {
  const authHeader = req.headers.get("authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const tokenCookie = cookieHeader
    .split("; ")
    .find((row) => row.startsWith("token="));

  return tokenCookie ? tokenCookie.split("=")[1] : null;
}