import { Request, Response } from "express";
import { User, sampleUser } from "../interfaces/User";
import { pool } from "../database/db";
import { RowDataPacket } from "mysql2";

async function GetProfile(req: Request, res: Response) {
  // TODO: Get user profile from database
  const userId = req.params.userId;

  const [user] = await pool.query<RowDataPacket[]>(
    "SELECT id, name, email, profilePicture, createdAt FROM user WHERE id = ?",
    [userId]
  );
  if (user.length === 0) {
    res.status(404).json({ message: "User not found" });
  }

  const [projectIds] = await pool.query(
    "SELECT id FROM member WHERE userId = ?",
    [userId]
  );

  let projects = [];
  for (let id in projectIds) {
    const [project] = await pool.query<RowDataPacket[]>(
      `select project.id, project.title, project.administratorId, name as adminName, email as adminEmail, profilePicture as profileUrl from project
        inner join member on project.id = member.projectId
        inner join user on member.userId = user.id
        where project.id = ?;`,
      [id]
    );
    console.log(project[0]);
    if (project.length > 0) {
      projects.push(project[0]);
    }
  }
  res.json({ ...user[0], projects });
}

async function UpdateProfile(req: Request, res: Response) {
  // TODO: Update user profile in database
  const userId = req.params.userId;
  let newProfile = req.body;
  newProfile.updatedAt = new Date();
  // if username is in request body, update it
  if (newProfile.username) {
    await pool.query<RowDataPacket[]>(`UPDATE user SET name = ? WHERE id = ?`, [
      newProfile.username,
      userId,
    ]);
  }
  if (newProfile.email) {
    await pool.query<RowDataPacket[]>(
      `UPDATE user SET email = ? WHERE id = ?`,
      [newProfile.email, userId]
    );
  }
  if (newProfile.password) {
    await pool.query<RowDataPacket[]>(
      `UPDATE user SET password = ? WHERE id = ?`,
      [newProfile.password, userId]
    );
  }
  if (newProfile.profilePicture) {
    await pool.query<RowDataPacket[]>(
      `UPDATE user SET profilePicture = ? WHERE id = ?`,
      [newProfile.profilePicture, userId]
    );
  }

  const [result] = await pool.query<RowDataPacket[]>(
    "SELECT id, name, email, profilePicture, createdAt FROM user WHERE id = ?",
    [userId]
  );
  res.json(result);
}

export { GetProfile, UpdateProfile };
