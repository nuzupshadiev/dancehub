import { Request, Response } from "express";
import { Video, sampleVideo } from "../interfaces/Video";
import { pool } from "../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import fs from "fs/promises";

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

  const [versionsRows] = await pool.query<RowDataPacket[]>(
    "SELECT version FROM video WHERE id = ?",
    [videoId]
  );
  const versions = versionsRows.map((row) => row.version);

  const [commentsData] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM comment WHERE videoId = ? and version = ?",
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
      `select * from reply
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
        likes: 0,
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
      id: video.uploaderId,
      name: video.uploaderName,
      profileUrl: video.uploaderProfile,
    },
    project: video.projectId,
    videoUrl: video.videoUrl,
    likes: video.likes,
    versions,
    comments,
  };
  res.json(videoResponse);
}

async function UploadVideo(req: Request, res: Response) {
  const { title, project, description } = req.body;
  const uploaderId = req.user!.id;

  if (!title || !project) {
    return res.status(400).json({ message: "Title and project are required" });
  }
  if (isNaN(project)) {
    return res.status(400).json({ message: "Project ID must be a number" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Video file is required" });
  }

  const videoFile = req.file;
  const videoUrl = `http://localhost:8000/static/videos/${videoFile.filename}`;

  const version = new Date();

  const [uploader] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM user WHERE id = ?",
    [uploaderId]
  );
  console.log(uploader);

  const [result] = await pool.query<RowDataPacket[]>(
    "INSERT INTO video (title, description, videoUrl, projectId, uploaderId, version, likes) VALUES (?, ?, ?, ?, ?, ?, 0);",
    [title, description || null, videoUrl, project, uploaderId, version]
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
    project: project,
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
  const videoUrl = `http://localhost:8000/static/videos/${videoFile.filename}`;

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
  if (user!.id !== userId) {
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
    "SELECT * FROM video WHERE projectId = ?",
    [projectId]
  );

  const videos = videosData[0].map((video) => ({
    id: video.id,
    title: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl || "",
  }));

  res.json({ totalVideos: videos.length, project: projectId, videos });
}

export { GetVideo, UploadVideo, UpdateVideo, DeleteVideo, GetVideoList };
