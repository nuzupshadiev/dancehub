import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  // dbUri: process.env.DB_URI || "mongodb://localhost:27017",
  jwtSecret: process.env.JWT_SECRET || "welcome_kaist",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "999h",
  salt: process.env.CODE_SALT || 9999,
};
