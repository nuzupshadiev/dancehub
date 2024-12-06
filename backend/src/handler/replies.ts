import { Request, Response } from "express";
import { pool } from "../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { AddTags, DeleteTags } from "../services/tags";
import { AddReplyTags, DeleteReplyTags } from "../services/replyTagService";

async function AddReply(req: Request, res: Response) {
  const { videoId, commentId } = req.params;
  const { content, tags } = req.body;
  const userId = req.user!.id;

  const [commentData] = await pool.query<RowDataPacket[]>(
    "select * from comment where id = ? and videoId = ?",
    [commentId, videoId]
  );

  if (commentData.length === 0 || commentData[0] === undefined) {
    return res.status(404).json({ message: "Comment not found" });
  }

  const version = commentData[0].version;
  const [resultData] = await pool.query<ResultSetHeader>(
    "insert into reply (commentId, userId, content, likes, modifiedAt) values (?, ?, ?, ?, ?)",
    [commentId, userId, content, 0, version]
  );

  const [replyData] = await pool.query<RowDataPacket[]>(
    "select * from reply where id = ?",
    [resultData.insertId]
  );

  const [user] = await pool.query<RowDataPacket[]>(
    "select * from user where id = ?",
    [userId]
  );

  const replyResponse = {
    id: replyData[0].id,
    commentId: replyData[0].commentId,
    user: {
      id: user[0].id,
      name: user[0].name,
      profileUrl: user[0].profilePicture,
    },
    content: replyData[0].content,
    likes: 0,
    modifiedAt: replyData[0].modifiedAt,
  };

  if (tags) {
    try {
      await AddReplyTags(tags, parseInt(videoId), version, resultData.insertId);
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  res.json({
    message: "Reply added successfully",
    reply: replyResponse,
  });
}

async function UpdateReply(req: Request, res: Response) {
  const { videoId, commentId, replyId } = req.params;
  const { content, oldtags, newtags } = req.body;
  const userId = req.user!.id;

  const [commentData] = await pool.query<RowDataPacket[]>(
    "select * from comment where id = ? and videoId = ?",
    [commentId, videoId]
  );
  if (commentData.length === 0 || commentData[0] === undefined) {
    return res.status(404).json({ message: "Comment not found" });
  }
  const version = commentData[0].version;

  const [replyData] = await pool.query<RowDataPacket[]>(
    "select * from reply where id = ? and commentId = ?",
    [replyId, commentId]
  );

  if (replyData.length === 0 || replyData[0] === undefined) {
    return res.status(404).json({ message: "Reply not found" });
  }

  if (replyData[0].userId != userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const [resultData] = await pool.query<ResultSetHeader>(
    "update reply set content = ?, modifiedAt = ? where id = ?",
    [content, new Date(), replyId]
  );

  if (resultData.affectedRows === 0) {
    return res.status(500).json({ message: "Failed to update reply" });
  }

  const [updatedReplyData] = await pool.query<RowDataPacket[]>(
    "select * from reply where id = ?",
    [replyId]
  );

  if (oldtags) {
    try {
      await DeleteReplyTags(parseInt(videoId), version, parseInt(replyId));
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  if (newtags) {
    try {
      await AddReplyTags(
        newtags,
        parseInt(videoId),
        version,
        parseInt(replyId)
      );
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  res.json({
    message: "Reply updated successfully",
    reply: updatedReplyData[0],
  });
}

async function DeleteReply(req: Request, res: Response) {
  const { videoId, commentId, replyId } = req.params;
  const userId = req.user!.id;
  const tags = req.body.tags;

  const [commentData] = await pool.query<RowDataPacket[]>(
    "select * from comment where id = ? and videoId = ?",
    [commentId, videoId]
  );
  if (commentData.length === 0 || commentData[0] === undefined) {
    return res.status(404).json({ message: "Comment not found" });
  }
  const version = commentData[0].version;

  const [replyData] = await pool.query<RowDataPacket[]>(
    "select * from reply where id = ? and commentId = ?",
    [replyId, commentId]
  );

  if (replyData.length === 0 || replyData[0] === undefined) {
    return res.status(404).json({ message: "Reply not found" });
  }

  if (replyData[0].userId != userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const [resultData] = await pool.query<ResultSetHeader>(
    "delete from reply where id = ?",
    [replyId]
  );

  if (resultData.affectedRows === 0) {
    return res.status(500).json({ message: "Failed to delete reply" });
  }

  res.json({ message: "Reply deleted successfully" });
}

async function LikeReply(req: Request, res: Response) {
  const { videoId, commentId, replyId } = req.params;
  const userId = req.user!.id;

  const [replyData] = await pool.query<RowDataPacket[]>(
    "select * from reply where id = ? and commentId = ?",
    [replyId, commentId]
  );

  if (replyData.length === 0 || replyData[0] === undefined) {
    return res.status(404).json({ message: "Reply not found" });
  }

  const [likeData] = await pool.query<RowDataPacket[]>(
    "select * from reply_likes where userId = ? and replyId = ?",
    [userId, replyId]
  );

  if (likeData.length > 0) {
    return res.status(400).json({ message: "Reply already liked" });
  }

  const [insertData] = await pool.query<ResultSetHeader>(
    "insert into reply_likes (userId, replyId) values (?, ?)",
    [userId, replyId]
  );

  if (insertData.affectedRows === 0) {
    return res.status(500).json({ message: "Failed to like reply" });
  }

  const [resultData] = await pool.query<ResultSetHeader>(
    "update reply set likes = likes + 1 where id = ?",
    [replyId]
  );

  if (resultData.affectedRows === 0) {
    return res.status(500).json({ message: "Failed to like reply" });
  }

  res.json({ message: "Reply liked successfully" });
}

async function UnlikeReply(req: Request, res: Response) {
  const { videoId, commentId, replyId } = req.params;
  const userId = req.user!.id;

  const [replyData] = await pool.query<RowDataPacket[]>(
    "select * from reply where id = ? and commentId = ?",
    [replyId, commentId]
  );

  if (replyData.length === 0 || replyData[0] === undefined) {
    return res.status(404).json({ message: "Reply not found" });
  }

  const [likeData] = await pool.query<RowDataPacket[]>(
    "select * from reply_likes where userId = ? and replyId = ?",
    [userId, replyId]
  );

  if (likeData.length === 0 || likeData[0] === undefined) {
    return res.status(400).json({ message: "Reply not liked" });
  }

  const [deleteData] = await pool.query<ResultSetHeader>(
    "delete from reply_likes where userId = ? and replyId = ?",
    [userId, replyId]
  );

  if (deleteData.affectedRows === 0) {
    return res.status(500).json({ message: "Failed to unlike reply" });
  }

  const [resultData] = await pool.query<ResultSetHeader>(
    "update reply set likes = likes - 1 where id = ?",
    [replyId]
  );

  if (resultData.affectedRows === 0) {
    return res.status(500).json({ message: "Failed to unlike reply" });
  }

  res.json({ message: "Reply unliked successfully" });
}

export { AddReply, UpdateReply, DeleteReply, LikeReply, UnlikeReply };
