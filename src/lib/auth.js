import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function createToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, key);
  return payload;
}