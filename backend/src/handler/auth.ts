import { Request, Response } from "express";
import { pool } from "../database/db";
import { PoolConnection, QueryError, RowDataPacket } from "mysql2";
import { generateToken } from "../services/authService";

async function Login(req: Request, res: Response) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM user WHERE email = ? AND password = ?",
    [email, password]
  );
  if (rows.length === 0 || rows[0] === undefined) {
    res.status(401).json({ message: "Invalid credentials" });
  }
  res.status(200).json({
    message: "Login successful",
    token: generateToken({ id: rows[0].id, sub: name, email: email }),
  });
}

async function Register(req: Request, res: Response) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM user WHERE email = ?",
    [email]
  );

  if (rows.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  const profilePicture = req.file;
  const imageUrl = profilePicture
    ? `http://localhost:8000/static/images/${profilePicture.filename}`
    : null;

  await pool.query<RowDataPacket[]>(
    "INSERT INTO user (name, email, password, createdAt, profilePicture) VALUES (?, ?, ?, ?, ?)",
    [name, email, password, new Date(), imageUrl]
  );

  const [newRows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM user WHERE email = ?",
    [email]
  );

  if (newRows.length === 0 || newRows[0] === undefined) {
    return res.status(500).json({ message: "Failed to register user" });
  }

  res.status(200).json({
    message: "User registered successfully",
    token: generateToken({ id: newRows[0].id, sub: name, email: email }),
  });
}

function Logout(req: Request, res: Response) {
  res.status(200).json({ message: "Logout successful" });
}

export { Login, Register, Logout };
