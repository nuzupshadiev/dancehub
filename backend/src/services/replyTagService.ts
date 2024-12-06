import { pool } from "../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

async function AddReplyTag(
  tag: string,
  projectId: number,
  videoId: number,
  version: Date,
  replyId: number
) {
  const [resultData] = await pool.query<ResultSetHeader>(
    "insert into reply_tag (name, projectId, videoId, version, replyId) values (?, ?, ?, ?, ?)",
    [tag, projectId, videoId, version, replyId]
  );
  if (resultData.affectedRows === 0) {
    throw new Error("Failed to create tag");
  }
}

async function AddReplyTags(
  tags: string[],
  videoId: number,
  version: Date,
  replyId: number
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
    await AddReplyTag(tag, projectId, videoId, version, replyId);
  }
}

async function DeleteReplyTag(
  tag: string,
  projectId: number,
  videoId: number,
  version: Date,
  replyId: number
) {
  const [resultData] = await pool.query<ResultSetHeader>(
    "delete from reply_tag where name = ? and projectId = ? and videoId = ? and version = ? and replyId = ?",
    [tag, projectId, videoId, version, replyId]
  );
  if (resultData.affectedRows === 0) {
    throw new Error("Failed to delete tag");
  }
}

async function DeleteReplyTags(
  videoId: number,
  version: Date,
  replyId: number
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
    "delete from reply_tag where projectId = ? and videoId = ? and version = ? and replyId = ?",
    [projectId, videoId, version, replyId]
  );
  if (resultData.affectedRows === 0) {
    throw new Error("Failed to delete tags");
  }
}

export { AddReplyTags, DeleteReplyTags };
