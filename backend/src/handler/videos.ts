import { Request, Response } from "express";
import { Video, sampleVideo } from "../interfaces/Video";
import { pool } from "../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import fs from "fs/promises";
import { version } from "os";

async function GetVideo(req: Request, res: Response) {
  const videoId = req.params.videoId;
  const version = req.query.version;

  let videoRows: RowDataPacket[];
  if (version) {
    [videoRows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM video WHERE id = ? AND version = ?",
      [videoId, version]
    );
  } else {
    [videoRows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM video WHERE id = ? ORDER BY version DESC LIMIT 1",
      [videoId]
    );
  }
  if (videoRows.length === 0) {
    return res.status(404).json({ message: "Video not found" });
  }
  const video = videoRows[0];

  const [videoLikeData] = await pool.query<RowDataPacket[]>(
    `select * from video_likes
    inner join user on video_likes.userId = user.id
    where videoId = ?`,
    [videoId]
  );

  const likedBy = videoLikeData.map((like) => ({
    id: like.userId,
    name: like.name,
    profileUrl: like.profilePicture,
  }));

  const [uploaderData] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM user WHERE id = ?",
    [video.uploaderId]
  );
  if (uploaderData.length === 0) {
    return res.status(500).json({ message: "Failed to fetch uploader" });
  }
  const uploader = uploaderData[0];

  const [versionsRows] = await pool.query<RowDataPacket[]>(
    "SELECT version FROM video WHERE id = ?",
    [videoId]
  );
  const versions = versionsRows.map((row) => row.version);

  const [commentsData] = await pool.query<RowDataPacket[]>(
    `select comment.id as id, videoid, version, start, end, userId, name, profilePicture, content, likes, modifiedAt from comment
    inner join user on comment.userId = user.id
    where videoId = ? and version = ?`,
    [videoId, video.version]
  );
  let comments = [];
  for (const comment of commentsData) {
    const [commenterData] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM user WHERE id = ?",
      [comment.userId]
    );
    const commenter = commenterData[0];

    let replies = [];

    const [repliesData] = await pool.query<RowDataPacket[]>(
      `select reply.id as id, commentId, userId, name, profilePicture, content, reply.modifiedAt as modifiedAt, likes from reply
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

    comments.push({
      id: comment.id,
      content: comment.content,
      start: comment.start,
      end: comment.end,
      user: {
        id: commenter.id,
        name: commenter.name,
        profileUrl: commenter.profilePicture,
      },
      replies,
    });
  }

  const videoResponse = {
    id: video.id,
    title: video.title,
    version: video.version,
    description: video.description,
    uploader: {
      id: uploader.id,
      name: uploader.name,
      profileUrl: uploader.profilePicture,
    },
    project: video.projectId,
    videoUrl: video.videoUrl,
    likes: video.likes,
    likedBy,
    versions,
    comments,
  };
  res.json(videoResponse);
}

async function UploadVideo(req: Request, res: Response) {
  const { title, projectId, description } = req.body;
  const uploaderId = req.user!.id;

  if (!title || !projectId) {
    return res.status(400).json({ message: "Title and project are required" });
  }
  if (isNaN(projectId)) {
    return res.status(400).json({ message: "Project ID must be a number" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Video file is required" });
  }

  const videoFile = req.file;
  const videoUrl = `https://dancehub-backend.run.goorm.site/static/videos/${videoFile.filename}`;

  const version = new Date();

  const [uploader] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM user WHERE id = ?",
    [uploaderId]
  );
  if (uploader.length === 0) {
    return res.status(404).json({ message: "Uploader not found" });
  }

  const [projectData] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM project WHERE id = ?",
    [projectId]
  );
  if (projectData.length === 0) {
    return res.status(404).json({ message: "Project not found" });
  }

  const [result] = await pool.query<RowDataPacket[]>(
    "INSERT INTO video (title, description, videoUrl, projectId, uploaderId, version, likes) VALUES (?, ?, ?, ?, ?, ?, 0);",
    [
      title,
      description || null,
      videoUrl,
      projectData[0].id,
      uploaderId,
      version,
    ]
  );

  const insertId = (result as any).insertId;

  const videoResponse = {
    id: insertId,
    title,
    description: description || "",
    uploader: {
      id: uploader[0].id,
      name: uploader[0].name,
      profileUrl: uploader[0].profilePicture, // Adjust if profile pictures are served differently
    },
    project: projectId,
    videoUrl,
    likes: 0,
    versions: [version.toISOString()],
  };
  return res.status(201).json({
    message: "Video uploaded successfully",
    video: videoResponse,
  });
}

async function UpdateVideo(req: Request, res: Response) {
  const videoId = req.params.videoId;
  const uploaderId = req.user!.id;
  const { title, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Video file is required" });
  }

  const videoFile = req.file;
  const videoUrl = `https://dancehub-backend.run.goorm.site/static/videos/${videoFile.filename}`;

  const version = new Date();

  const [uploader] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM user WHERE id = ?",
    [uploaderId]
  );

  const [videoData] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM video WHERE id = ? order by version desc limit 1",
    [videoId]
  );
  const video = videoData[0];

  const [result] = await pool.query<RowDataPacket[]>(
    "INSERT INTO video (id, title, description, videoUrl, projectId, uploaderId, version, likes) VALUES (?, ?, ?, ?, ?, ?, ?, 0);",
    [
      videoId,
      title || video.title,
      description || video.description,
      videoUrl,
      video.projectId,
      uploaderId,
      version,
    ]
  );

  const [versionsData] = await pool.query<RowDataPacket[]>(
    "SELECT version FROM video WHERE id = ?",
    [videoId]
  );
  const versions = versionsData.map((row) => row.version);

  const videoResponse = {
    id: videoId,
    title,
    description: description || "",
    uploader: {
      id: uploader[0].id,
      name: uploader[0].name,
      profileUrl: uploader[0].profilePicture, // Adjust if profile pictures are served differently
    },
    project: video.projectId,
    videoUrl,
    likes: 0,
    versions,
  };
  return res.status(201).json({
    message: "Video uploaded successfully",
    video: videoResponse,
  });
}

async function DeleteVideo(req: Request, res: Response) {
  const videoId = req.params.videoId;
  const version = req.query.version;
  const user = req.user;

  const [videoData] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM video WHERE id = ?",
    [videoId]
  );

  if (videoData.length === 0) {
    return res.status(404).json({ message: "Video not found" });
  }

  const userId = videoData[0].uploaderId;
  if (user!.id != userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (version) {
    const convertedVersion = new Date(version as string);
    const [result] = await pool.query<ResultSetHeader>(
      "delete from video where id = ? and version = ?",
      [videoId, convertedVersion]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Video not found" });
    }
  } else {
    const [result] = await pool.query<ResultSetHeader>(
      "delete from video where id = ?",
      [videoId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Video not found" });
    }
  }

  const filename = videoData[0].videoUrl.split("/").pop();
  try {
    await fs.unlink(__dirname + "/../static/videos/" + filename);
  } catch (fileError) {
    console.error(fileError);
    res.status(500).json({ message: "Error deleting video file" });
  }
  return res.json({ message: "Video deleted successfully" });
}

async function GetVideoList(req: Request, res: Response) {
  const projectId = req.params.projectId;

  const videosData = await pool.query<RowDataPacket[]>(
    `SELECT distinct id, title, description, uploaderId FROM video 
    WHERE projectId = ?`,
    [projectId]
  );

  const [projectData] = await pool.query<RowDataPacket[]>(
    "SELECT title FROM project WHERE id = ?",
    [projectId]
  );

  if (projectData.length === 0) {
    return res.status(404).json({ message: "Project not found" });
  }

  const title = projectData[0].title;

  const videos = videosData[0].map((video) => ({
    id: video.id,
    title: video.title,
    description: video.description,
    isAdmin:
      req.user!.id == video.uploaderId ||
      req.user!.id == projectData[0].administratorId,
  }));

  res.json({
    totalVideos: videos.length,
    project: projectId,
    title,
    videos,
  });
}

async function LikeVideo(req: Request, res: Response) {
  const videoId = req.params.videoId;
  let versionString = req.query.version;
  const userId = req.user!.id;

  if (!versionString) {
    const [versionData] = await pool.query<RowDataPacket[]>(
      "SELECT version FROM video WHERE id = ? ORDER BY version DESC LIMIT 1",
      [videoId]
    );
    if (versionData.length === 0) {
      return res.status(404).json({ message: "Video not found" });
    }
    versionString = versionData[0].version;
  }
  const version = new Date(versionString as string);

  const [videoData] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM video WHERE id = ? and version = ?",
    [videoId, version]
  );

  if (videoData.length === 0) {
    return res.status(404).json({ message: "Video not found" });
  }

  const [likeData] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM video_likes WHERE videoId = ? AND userId = ?",
    [videoId, userId]
  );

  if (likeData.length > 0) {
    return res.status(400).json({ message: "Already liked" });
  }

  const [insertionData] = await pool.query<ResultSetHeader>(
    "INSERT INTO video_likes (videoId, userId, version) VALUES (?, ?, ?)",
    [videoId, userId, version]
  );
  if (insertionData.affectedRows === 0) {
    return res.status(500).json({ message: "Error liking video" });
  }

  const [updateData] = await pool.query<ResultSetHeader>(
    "UPDATE video SET likes = likes + 1 WHERE id = ?",
    [videoId]
  );

  if (updateData.affectedRows === 0) {
    return res.status(500).json({ message: "Error liking video" });
  }

  res.json({ message: "Video liked successfully" });
}

async function UnlikeVideo(req: Request, res: Response) {
  const videoId = req.params.videoId;
  let versionString = req.query.version;
  const userId = req.user!.id;

  if (!versionString) {
    const [versionData] = await pool.query<RowDataPacket[]>(
      "SELECT version FROM video WHERE id = ? ORDER BY version DESC LIMIT 1",
      [videoId]
    );
    if (versionData.length === 0) {
      return res.status(404).json({ message: "Video not found" });
    }
    versionString = versionData[0].version;
  }
  const version = new Date(versionString as string);

  const [videoData] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM video WHERE id = ? and version = ?",
    [videoId, version]
  );

  if (videoData.length === 0) {
    return res.status(404).json({ message: "Video not found" });
  }

  const [likeData] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM video_likes WHERE videoId = ? AND userId = ?",
    [videoId, userId]
  );

  if (likeData.length === 0) {
    return res.status(400).json({ message: "Already unliked" });
  }

  const [removalData] = await pool.query<ResultSetHeader>(
    "DELETE FROM video_likes WHERE videoId = ? AND userId = ? and version = ?",
    [videoId, userId, version]
  );
  if (removalData.affectedRows === 0) {
    return res.status(500).json({ message: "Error unliking video" });
  }

  const [resultData] = await pool.query<ResultSetHeader>(
    "UPDATE video SET likes = likes - 1 WHERE id = ? and version = ?",
    [videoId, version]
  );

  if (resultData.affectedRows === 0) {
    return res.status(500).json({ message: "Error unliking video" });
  }

  res.json({ message: "Video unliked successfully" });
}

export {
  GetVideo,
  UploadVideo,
  UpdateVideo,
  DeleteVideo,
  GetVideoList,
  LikeVideo,
  UnlikeVideo,
};
