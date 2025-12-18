import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function signToken(payload: any) {
  return jwt.sign(payload, SECRET, { expiresIn: "10min" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}
