import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

interface Payload {
  id: number;
  sub: string;
  email: string;
}

export const generateToken = (payload: Payload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): Payload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Payload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
