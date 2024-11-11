import { Request, Response } from "express";
import { sampleComment } from "../interfaces/Comment";
import { pool } from "../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

// AddComments request body
type AddCommentBody = {
  content: string;
  start: string;
  end: string;
};

async function GetComments(req: Request, res: Response) {
  const videoId = req.params.videoId;
  let versionString = req.query.version;

  if (!versionString) {
    const [versionData] = await pool.query<RowDataPacket[]>(
      "select version from video where id = ? order by version desc limit 1",
      [videoId]
    );
    if (versionData.length === 0) {
      return res.status(404).json({ message: "Video not found" });
    }
    versionString = versionData[0].version;
  }
  const version = new Date(versionString as string);

  const [commentsData] = await pool.query<RowDataPacket[]>(
    `select * from comment
    inner join user on comment.userId = user.id
    where videoId = ? and version = ?`,
    [videoId, version]
  );

  let commentsResponse = [];

  // Fetch likedBy data for each comment
  for (let comment of commentsData) {
    const [likesData] = await pool.query<RowDataPacket[]>(
      `select * from likes
      inner join user on likes.userId = user.id
      where commentId = ?`,
      [comment.id]
    );
    const likedBy = likesData.map((row) => {
      return {
        id: row.id,
        name: row.name,
        profileUrl: row.profilePicture,
      };
    });
    commentsResponse.push({
      id: comment.id,
      videoId: comment.videoId,
      version: comment.version,
      start: comment.start,
      end: comment.end,
      user: {
        id: comment.userId,
        name: comment.name,
        profileUrl: comment.profilePicture,
      },
      content: comment.content,
      likes: comment.likes,
      likedBy: likedBy,
      modifiedAt: comment.modifiedAt,
    });
  }

  res.json({ totalComments: commentsData.length, comments: commentsResponse });
}

async function AddComment(req: Request, res: Response) {
  const videoId = req.params.videoId;
  let versionString = req.query.version;
  const userId = req.user!.id;

  const { content, start, end } = req.body as AddCommentBody;

  if (!versionString) {
    const [versionData] = await pool.query<RowDataPacket[]>(
      "select version from video where id = ? order by version desc limit 1",
      [videoId]
    );
    if (versionData.length === 0) {
      return res.status(404).json({ message: "Video not found" });
    }
    versionString = versionData[0].version;
  }
  const version = new Date(versionString as string);

  const [resultData] = await pool.query<ResultSetHeader>(
    "insert into comment (videoId, version, start, end, userId, content, likes, modifiedAt) values (?, ?, ?, ?, ?, ?, ?, ?)",
    [videoId, version, start, end, userId, content, 0, new Date()]
  );

  const insertId = resultData.insertId;
  const affectedRows = resultData.affectedRows;

  if (affectedRows === 0) {
    return res.status(500).json({ message: "Failed to add comment" });
  }

  const [commentData] = await pool.query<RowDataPacket[]>(
    "select * from comment where id = ?",
    [insertId]
  );

  if (commentData.length === 0) {
    return res
      .status(404)
      .json({ message: "Comment generated, but not found" });
  }
  const comment = commentData[0];

  const commentResponse = {
    id: comment.id,
    videoId: comment.videoId,
    version: comment.version,
    start: comment.start,
    end: comment.end,
    user: {
      id: comment.userId,
      name: comment.name,
      profileUrl: comment.profilePicture,
    },
    content: comment.content,
    likes: comment.likes,
    likedBy: [],
    modifiedAt: comment.modifiedAt,
  };
  res.json({ message: "Comment added successfully", comment: commentResponse });
}

async function UpdateComment(req: Request, res: Response) {
  const videoId = req.params.videoId;
  const commentId = req.params.commentId;
  const { content, start, end } = req.body;

  const [commentData] = await pool.query<RowDataPacket[]>(
    "select * from comment where id = ?",
    [commentId]
  );

  if (commentData.length === 0) {
    return res.status(404).json({ message: "Comment not found" });
  }

  if (commentData[0].videoId !== videoId) {
    return res
      .status(404)
      .json({ message: "Comment not found. videoId may be wrong." });
  }

  const [videoData] = await pool.query<RowDataPacket[]>(
    `select * from video
      inner join project on video.projectId = project.id
      where video.id = ?`,
    [videoId]
  );

  if (videoData.length === 0) {
    return res.status(404).json({ message: "Video not found" });
  }

  if (
    commentData[0].userId !== req.user!.id &&
    req.user!.id !== videoData[0].administratorId
  ) {
    return res.status(403).json({ message: "Unauthorized to update comment" });
  }

  const [resultData] = await pool.query<ResultSetHeader>(
    "update comment set content = ?, start = ?, end = ?, modifiedAt = ? where id = ?",
    [content, start, end, new Date(), commentId]
  );

  const affectedRows = resultData.affectedRows;
  if (affectedRows === 0) {
    return res.status(500).json({ message: "Failed to update comment" });
  }

  const [updatedCommentData] = await pool.query<RowDataPacket[]>(
    "select * from comment where id = ?",
    [commentId]
  );
  const comment = updatedCommentData[0];

  const [likedByData] = await pool.query<RowDataPacket[]>(
    `select * from likes
    inner join user on likes.userId = user.id
    where commentId = ?`,
    [commentId]
  );

  const likedBy = likedByData.map((row) => {
    return {
      id: row.id,
      name: row.name,
      profileUrl: row.profilePicture,
    };
  });

  const commentResponse = {
    id: comment.id,
    videoId: comment.videoId,
    version: comment.version,
    start: comment.start,
    end: comment.end,
    user: {
      id: comment.userId,
      name: comment.name,
      profileUrl: comment.profilePicture,
    },
    content: comment.content,
    likes: comment.likes,
    likedBy: likedBy,
    modifiedAt: comment.modifiedAt,
  };
  res.json({
    message: "Comment updated successfully",
    comment: commentResponse,
  });
}

async function DeleteComment(req: Request, res: Response) {
  const commentId = req.params.commentId;
  const videoId = req.params.videoId;
  const userId = req.user!.id;

  // get comment
  const [commentData] = await pool.query<RowDataPacket[]>(
    "select * from comment where id = ? and videoId = ?",
    [commentId, videoId]
  );

  if (commentData.length === 0) {
    return res.status(404).json({ message: "Comment not found" });
  }
  const comment = commentData[0];

  // get video administratorId
  const [videoData] = await pool.query<RowDataPacket[]>(
    `select * from video
      inner join project on video.projectId = project.id
      where video.id = ?`,
    [videoId]
  );
  if (videoData.length === 0) {
    return res.status(404).json({ message: "Video not found" });
  }
  const administratorId = videoData[0].administratorId;

  // check if user is authorized to delete comment
  if (comment.userId !== userId && userId !== administratorId) {
    return res.status(403).json({ message: "Unauthorized to delete comment" });
  }

  // delete likes
  await pool.query<ResultSetHeader>("delete from likes where commentId = ?", [
    commentId,
  ]);

  // delete comment
  const [resultData] = await pool.query<ResultSetHeader>(
    "delete from comment where id = ?",
    [commentId]
  );

  const affectedRows = resultData.affectedRows;
  if (affectedRows === 0) {
    return res.status(500).json({ message: "Failed to delete comment" });
  }

  res.json({ message: "Comment deleted successfully" });
}

export { GetComments, AddComment, UpdateComment, DeleteComment };
