import { Request, Response } from "express";
import { User, sampleUser } from "../interfaces/User";
import { pool } from "../database/db";
import { RowDataPacket } from "mysql2";

async function GetUserInfo(userId: number) {
  const [user] = await pool.query<RowDataPacket[]>(
    "SELECT id, name, email, profilePicture, createdAt FROM user WHERE id = ?",
    [userId]
  );
  if (user.length === 0 || user[0] === undefined) {
    return null;
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
    if (project.length > 0) {
      projects.push(project[0]);
    }
  }

  return { ...user[0], projects };
}

async function GetProfile(req: Request, res: Response) {
  let userId = req.params.userId;

  if (!userId) {
    userId = req.user!.id.toString();
  }

  const user = await GetUserInfo(parseInt(userId));

  if (user === null) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }

  res.json({ user: { ...user } });
}

async function UpdateProfile(req: Request, res: Response) {
  const userId = req.params.userId;
  const user = req.user;
  if (user!.id !== Number(userId)) {
    return res.status(403).json({ message: "Forbidden" });
  }

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
  if (req.file) {
    const profilePicture = req.file;
    const imageUrl = `http://34.170.203.67:8000/static/images/${profilePicture.filename}`;
    await pool.query<RowDataPacket[]>(
      `UPDATE user SET profilePicture = ? WHERE id = ?`,
      [imageUrl, userId]
    );
  }

  const result = await GetUserInfo(parseInt(userId));
  if (result === null) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
  res.json(result);
}

async function GetAllUsers(req: Request, res: Response) {
  const [users] = await pool.query<RowDataPacket[]>(
    "SELECT id, name, email, password, profilePicture, createdAt FROM user"
  );
  res.json({ users });
}

export { GetProfile, UpdateProfile, GetUserInfo, GetAllUsers };
