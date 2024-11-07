import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;

export function verifyToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}
