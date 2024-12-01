import express, { Request, Response } from "express";
import path from "path";
import { config } from "./config";
import * as users from "./handler/users";
import * as videos from "./handler/videos";
import * as comments from "./handler/comments";
import * as auth from "./handler/auth";
import * as projects from "./handler/projects";
import * as replies from "./handler/replies";
import { jwtMiddleware } from "./middleware/jwtMiddleware";
import { videoUpload, imageUpload } from "./middleware/upload";
import cors from "cors";

const app = express();

// Allow cors
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "server is now working",
  });
});

// Serve static files (e.g., videos, images)
app.use("/static", express.static(path.join(__dirname, "static"), {}));

// Auth API routes
app.post(
  "/api/auth/register",
  imageUpload.single("profilePicture"),
  auth.Register
);
app.post("/api/auth/login", auth.Login);
app.post("/api/auth/logout", jwtMiddleware, auth.Logout);

// User API routes
app.get("/api/users/all", users.GetAllUsers);
app.get("/api/users/:userId", users.GetProfile);
app.get("/api/users", jwtMiddleware, users.GetProfile);
app.put(
  "/api/users/:userId",
  imageUpload.single("profilePicture"),
  jwtMiddleware,
  users.UpdateProfile
);

// Video API routes
app.get("/api/videos/:videoId", jwtMiddleware, videos.GetVideo);
app.post(
  "/api/videos/",
  jwtMiddleware,
  videoUpload.single("videoFile"),
  videos.UploadVideo
);
app.put(
  "/api/videos/:videoId",
  jwtMiddleware,
  videoUpload.single("videoFile"),
  videos.UpdateVideo
);
app.delete("/api/videos/:videoId", jwtMiddleware, videos.DeleteVideo);
app.get("/api/videos/list/:projectId", videos.GetVideoList);
app.post("/api/videos/:videoId/like", jwtMiddleware, videos.LikeVideo);
app.post("/api/videos/:videoId/unlike", jwtMiddleware, videos.UnlikeVideo);

// Comments API routes
app.get("/api/videos/:videoId/comments/:commentId", comments.GetComment);
app.get("/api/videos/:videoId/comments", comments.GetComments);
app.post("/api/videos/:videoId/comments", jwtMiddleware, comments.AddComment);
app.put(
  "/api/videos/:videoId/comments/:commentId",
  jwtMiddleware,
  comments.UpdateComment
);
app.delete(
  "/api/videos/:videoId/comments/:commentId",
  jwtMiddleware,
  comments.DeleteComment
);
app.post(
  "/api/videos/:videoId/comments/:commentId/like",
  jwtMiddleware,
  comments.LikeComment
);
app.post(
  "/api/videos/:videoId/comments/:commentId/unlike",
  jwtMiddleware,
  comments.UnlikeComment
);

// Replies API routes
app.post(
  "/api/videos/:videoId/comments/:commentId/replies",
  jwtMiddleware,
  replies.AddReply
);
app.put(
  "/api/videos/:videoId/comments/:commentId/replies/:replyId",
  jwtMiddleware,
  replies.UpdateReply
);
app.delete(
  "/api/videos/:videoId/comments/:commentId/replies/:replyId",
  jwtMiddleware,
  replies.DeleteReply
);
app.post(
  "/api/videos/:videoId/comments/:commentId/replies/:replyId/like",
  jwtMiddleware,
  replies.LikeReply
);
app.post(
  "/api/videos/:videoId/comments/:commentId/replies/:replyId/unlike",
  jwtMiddleware,
  replies.UnlikeReply
);

// Projects API routes
app.get("/api/projects/:projectId", jwtMiddleware, projects.GetProject);
app.get("/api/projects", jwtMiddleware, projects.GetProjects);
app.post("/api/projects", jwtMiddleware, projects.AddProject);
app.put("/api/projects/:projectId", jwtMiddleware, projects.UpdateProject);
app.get(
  "/api/projects/code/:projectId",
  jwtMiddleware,
  projects.GetProjectCode
);
app.post(
  "/api/projects/code/:projectCode",
  jwtMiddleware,
  projects.JoinProject
);
app.delete("/api/projects/:projectId", jwtMiddleware, projects.DeleteProject);

app.get(
  "/api/projects/:projectId/tags/:tagName",
  jwtMiddleware,
  projects.GetTagRelatedVideos
);

// Start the server
app.listen(config.port, () => {
  console.log(`Origin server running on port ${config.port}`);
});
