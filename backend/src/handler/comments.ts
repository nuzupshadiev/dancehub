import { Request, Response } from "express";
import { sampleComment } from "../interfaces/Comment";
import { pool } from "../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { AddTags, DeleteTags } from "../services/tags";
import {
  AddCommentTags,
  DeleteCommentTags,
} from "../services/commentTagService";

async function GetComment(req: Request, res: Response) {
  const videoId = req.params.videoId;
  const commentId = req.params.commentId;

  const [commentData] = await pool.query<RowDataPacket[]>(
    `select comment.id as id, videoid, version, start, end, userId, name, profilePicture, content, likes, modifiedAt from comment
    inner join user on comment.userId = user.id
    where videoId = ? and comment.id = ?`,
    [videoId, commentId]
  );

  if (commentData.length === 0 || commentData[0] === undefined) {
    return res.status(404).json({ message: "Comment not found" });
  }

  const comment = commentData[0];

  const [likedByData] = await pool.query<RowDataPacket[]>(
    `select user.id as id, name, profilePicture from comment_likes
    inner join user on comment_likes.userId = user.id
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

  const [repliesData] = await pool.query<RowDataPacket[]>(
    `select reply.id as id, commentId, userId, name, profilePicture, content, modifiedAt, likes from reply
    inner join user on reply.userId = user.id
    where commentId = ?`,
    [commentId]
  );

  let replies = [];
  for (let reply of repliesData) {
    replies.push({
      id: reply.id,
      commentId: reply.commentId,
      user: {
        id: reply.userId,
        name: reply.name,
        profileUrl: reply.profilePicture,
      },
      content: reply.content,
      likes: reply.likes,
      modifiedAt: reply.modifiedAt,
    });
  }

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
    replies: replies,
    modifiedAt: comment.modifiedAt,
  };

  res.json({ comment: commentResponse });
}

async function GetComments(req: Request, res: Response) {
  const videoId = req.params.videoId;
  let versionString = req.query.version;

  if (!versionString) {
    const [versionData] = await pool.query<RowDataPacket[]>(
      "select version from video where id = ? order by version desc limit 1",
      [videoId]
    );
    if (versionData.length === 0 || versionData[0] === undefined) {
      return res.status(404).json({ message: "Video not found" });
    }
    versionString = versionData[0].version;
  }
  const version = new Date(versionString as string);

  const [commentsData] = await pool.query<RowDataPacket[]>(
    `select distinct comment.id as id, videoid, version, start, end, userId, name, profilePicture, content, likes, modifiedAt from comment
    inner join user on comment.userId = user.id
    where videoId = ? and version = ?`,
    [videoId, version]
  );

  console.log(version);
  console.log(commentsData);

  let commentsResponse = [];

  // Fetch likedBy data for each comment
  for (let comment of commentsData) {
    const [likesData] = await pool.query<RowDataPacket[]>(
      `select * from comment_likes
      inner join user on comment_likes.userId = user.id
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

    // Fetch replies data for each comment
    let replies = [];

    const [repliesData] = await pool.query<RowDataPacket[]>(
      `select reply.id as id, commentId, userId, name, profilePicture, content, modifiedAt, likes from reply
      inner join user on reply.userId = user.id
      where commentId = ?`,
      [comment.id]
    );

    for (let reply of repliesData) {
      replies.push({
        id: reply.id,
        commentId: reply.commentId,
        user: {
          id: reply.userId,
          name: reply.name,
          profileUrl: reply.profilePicture,
        },
        content: reply.content,
        likes: reply.likes,
        modifiedAt: reply.modifiedAt,
      });
    }

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
      replies: replies,
      modifiedAt: comment.modifiedAt,
    });
  }

  res.json({ totalComments: commentsData.length, comments: commentsResponse });
}

async function AddComment(req: Request, res: Response) {
  const videoId = req.params.videoId;
  let versionString = req.query.version;
  const userId = req.user!.id;

  const { content, start, end, tags } = req.body;

  if (!versionString) {
    const [versionData] = await pool.query<RowDataPacket[]>(
      "select version from video where id = ? order by version desc limit 1",
      [videoId]
    );
    if (versionData.length === 0 || versionData[0] === undefined) {
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
    `select * from comment
    inner join user on comment.userId = user.id
    where comment.id = ?`,
    [insertId]
  );

  if (commentData.length === 0 || commentData[0] === undefined) {
    return res
      .status(404)
      .json({ message: "Comment generated, but not found" });
  }
  const comment = commentData[0];

  const commentResponse = {
    id: insertId,
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

  if (tags) {
    try {
      await AddCommentTags(tags, comment.videoId, comment.version, insertId);
    } catch (err) {
      return res.status(500).json({ message: "Failed to add tags" });
    }
  }

  res.json({ message: "Comment added successfully", comment: commentResponse });
}

async function UpdateComment(req: Request, res: Response) {
  const videoId = req.params.videoId;
  const commentId = req.params.commentId;
  const { content, start, end, oldtags, newtags } = req.body;

  const [commentData] = await pool.query<RowDataPacket[]>(
    "select * from comment where id = ?",
    [commentId]
  );

  if (commentData.length === 0 || commentData[0] === undefined) {
    return res.status(404).json({ message: "Comment not found" });
  }

  if (commentData[0].videoId != videoId) {
    console.log(commentData[0].videoId);
    console.log(videoId);
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

  if (videoData.length === 0 || videoData[0] === undefined) {
    return res.status(404).json({ message: "Video not found" });
  }

  if (
    commentData[0].userId != req.user!.id &&
    req.user!.id != videoData[0].administratorId
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
    `select * from comment_likes
    inner join user on comment_likes.userId = user.id
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

  if (oldtags) {
    try {
      await DeleteCommentTags(comment.videoId, comment.version, comment.id);
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  if (newtags) {
    try {
      await AddCommentTags(
        newtags,
        comment.videoId,
        comment.version,
        comment.id
      );
    } catch (err) {
      return res.status(500).json({ message: "Failed to add tags" });
    }
  }

  res.json({
    message: "Comment updated successfully",
    comment: commentResponse,
  });
}

async function DeleteComment(req: Request, res: Response) {
  const commentId = req.params.commentId;
  const videoId = req.params.videoId;
  const userId = req.user!.id;
  const tags = req.body.tags;

  // get comment
  const [commentData] = await pool.query<RowDataPacket[]>(
    "select * from comment where id = ? and videoId = ?",
    [commentId, videoId]
  );

  if (commentData.length === 0 || commentData[0] === undefined) {
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
  if (videoData.length === 0 || videoData[0] === undefined) {
    return res.status(404).json({ message: "Video not found" });
  }
  const administratorId = videoData[0].administratorId;

  // check if user is authorized to delete comment
  if (comment.userId != userId && userId != administratorId) {
    return res.status(403).json({ message: "Unauthorized to delete comment" });
  }

  // delete likes
  await pool.query<ResultSetHeader>(
    "delete from comment_likes where commentId = ?",
    [commentId]
  );

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

async function LikeComment(req: Request, res: Response) {
  const commentId = req.params.commentId;
  const userId = req.user!.id;

  const [commentData] = await pool.query<RowDataPacket[]>(
    "select * from comment where id = ?",
    [commentId]
  );

  if (commentData.length === 0 || commentData[0] === undefined) {
    return res.status(404).json({ message: "Comment not found" });
  }

  const [likeData] = await pool.query<RowDataPacket[]>(
    "select * from comment_likes where commentId = ? and userId = ?",
    [commentId, userId]
  );

  if (likeData.length > 0) {
    return res.status(400).json({ message: "Already liked" });
  }

  const [resultData] = await pool.query<ResultSetHeader>(
    "insert into comment_likes (commentId, userId) values (?, ?)",
    [commentId, userId]
  );

  const insertId = resultData.insertId;
  const affectedRows = resultData.affectedRows;

  if (affectedRows === 0) {
    return res.status(500).json({ message: "Failed to like comment" });
  }

  await pool.query<ResultSetHeader>(
    "update comment set likes = likes + 1 where id = ?",
    [commentId]
  );

  res.json({ message: "Comment liked successfully" });
}

async function UnlikeComment(req: Request, res: Response) {
  const commentId = req.params.commentId;
  const userId = req.user!.id;

  const [commentData] = await pool.query<RowDataPacket[]>(
    "select * from comment where id = ?",
    [commentId]
  );

  if (commentData.length === 0 || commentData[0] === undefined) {
    return res.status(404).json({ message: "Comment not found" });
  }

  const [likeData] = await pool.query<RowDataPacket[]>(
    "select * from comment_likes where commentId = ? and userId = ?",
    [commentId, userId]
  );

  if (likeData.length === 0 || likeData[0] === undefined) {
    return res.status(400).json({ message: "Already unliked" });
  }

  const [removalData] = await pool.query<ResultSetHeader>(
    "DELETE FROM comment_likes where commentId = ? and userId = ?",
    [commentId, userId]
  );

  const affectedRows = removalData.affectedRows;

  if (affectedRows === 0) {
    return res.status(500).json({ message: "Failed to like comment" });
  }

  const [resultData] = await pool.query<ResultSetHeader>(
    "update comment set likes = likes - 1 where id = ?",
    [commentId]
  );

  if (resultData.affectedRows === 0) {
    return res.status(500).json({ message: "Failed to unlike comment" });
  }

  res.json({ message: "Comment liked successfully" });
}

export {
  GetComment,
  GetComments,
  AddComment,
  UpdateComment,
  DeleteComment,
  LikeComment,
  UnlikeComment,
};
