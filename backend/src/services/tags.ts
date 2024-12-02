import { pool } from "../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

async function AddTag(
  name: string,
  projectId: number,
  videoId: number,
  version: Date
) {
  const [tagData] = await pool.query<RowDataPacket[]>(
    "select * from tag where name = ? and projectId = ? and videoId = ? and version = ?",
    [name, projectId, videoId, version]
  );
  // If tag exists, increment refcount
  if (tagData.length > 0) {
    const [resultData] = await pool.query<ResultSetHeader>(
      "update tag set refcount = refcount + 1 where id = ?",
      [tagData[0].id]
    );
    if (resultData.affectedRows === 0) {
      throw new Error("Failed to increment refcount");
    }
  } else {
    // Otherwise, create a new tag
    const [resultData] = await pool.query<ResultSetHeader>(
      "insert into tag (name, projectId, videoId, version, refcount) values (?, ?, ?, ?, ?)",
      [name, projectId, videoId, version, 1]
    );
    if (resultData.affectedRows === 0) {
      throw new Error("Failed to create tag");
    }
  }
}

async function AddTags(names: string[], videoId: number, version: Date) {
  const [projectData] = await pool.query<RowDataPacket[]>(
    "select * from video where id = ?",
    [videoId]
  );
  if (projectData.length === 0) {
    throw new Error("Video not found");
  }
  const projectId = projectData[0].projectId;

  for (const name of names) {
    await AddTag(name, projectId, videoId, version);
  }
}

async function DeleteTag(
  name: string,
  projectId: number,
  videoId: number,
  version: Date
) {
  const [tagData] = await pool.query<RowDataPacket[]>(
    "select * from tag where name = ? and projectId = ? and videoId = ? and version = ?",
    [name, projectId, videoId, version]
  );
  // If tag exists, decrement refcount
  if (tagData.length > 0) {
    const [resultData] = await pool.query<ResultSetHeader>(
      "update tag set refcount = refcount - 1 where id = ?",
      [tagData[0].id]
    );
    if (resultData.affectedRows === 0) {
      throw new Error("Failed to decrement refcount");
    }

    // If refcount is 0, delete the tag
    if (tagData[0].refcount === 1) {
      const [deleteData] = await pool.query<ResultSetHeader>(
        "delete from tag where id = ?",
        [tagData[0].id]
      );
      if (deleteData.affectedRows === 0) {
        throw new Error("Failed to delete tag");
      }
    }
  } else {
    throw new Error("Tag not found");
  }
}

async function DeleteTags(names: string[], videoId: number, version: Date) {
  const [projectData] = await pool.query<RowDataPacket[]>(
    "select * from video where id = ?",
    [videoId]
  );
  if (projectData.length === 0) {
    throw new Error("Video not found");
  }
  const projectId = projectData[0].projectId;

  for (const name of names) {
    await DeleteTag(name, projectId, videoId, version);
  }
}

export { AddTags, DeleteTags };
