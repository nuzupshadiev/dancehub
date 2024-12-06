import { pool } from "../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

async function AddCommentTag(
  tag: string,
  projectId: number,
  videoId: number,
  version: Date,
  commentId: number
) {
  const [resultData] = await pool.query<ResultSetHeader>(
    "insert into comment_tag (name, projectId, videoId, version, commentId) values (?, ?, ?, ?, ?)",
    [tag, projectId, videoId, version, commentId]
  );
  if (resultData.affectedRows === 0) {
    throw new Error("Failed to create tag");
  }
}

async function AddCommentTags(
  tags: string[],
  videoId: number,
  version: Date,
  commentId: number
) {
  const [projectData] = await pool.query<RowDataPacket[]>(
    "select * from video where id = ?",
    [videoId]
  );
  if (projectData.length === 0) {
    throw new Error("Video not found");
  }
  const projectId = projectData[0].projectId;

  for (const tag of tags) {
    await AddCommentTag(tag, projectId, videoId, version, commentId);
  }
}

async function DeleteCommentTag(
  tag: string,
  projectId: number,
  videoId: number,
  version: Date,
  commentId: number
) {
  const [resultData] = await pool.query<ResultSetHeader>(
    "delete from comment_tag where name = ? and projectId = ? and videoId = ? and version = ? and commentId = ?",
    [tag, projectId, videoId, version, commentId]
  );
  if (resultData.affectedRows === 0) {
    throw new Error("Failed to delete tag");
  }
}

async function DeleteCommentTags(
  videoId: number,
  version: Date,
  commentId: number
) {
  const [projectData] = await pool.query<RowDataPacket[]>(
    "select * from video where id = ?",
    [videoId]
  );
  if (projectData.length === 0) {
    throw new Error("Video not found");
  }
  const projectId = projectData[0].projectId;

  const [resultData] = await pool.query<ResultSetHeader>(
    "delete from comment_tag where projectId = ? and videoId = ? and version = ? and commentId = ?",
    [projectId, videoId, version, commentId]
  );
  if (resultData.affectedRows === 0) {
    throw new Error("Failed to delete tags");
  }
}

export { AddCommentTags, DeleteCommentTags };
