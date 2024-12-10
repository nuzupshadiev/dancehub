import { pool } from "../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

const Director = {
  name: "Director",
  email: "test",
  password: "test",
  id: 13,
};
const Jane = {
  name: "Jane",
  email: "jane",
  password: "jane",
  id: 15,
};
const Mary = {
  name: "Mary",
  email: "mary",
  password: "mary",
  id: 16,
};
const Rachel = {
  name: "Rachel",
  email: "rachel",
  password: "rachel",
  id: 17,
};
const Tom = {
  name: "Tom",
  email: "tom",
  password: "tom",
  id: 18,
};
const Sharon = {
  name: "Sharon",
  email: "sharon",
  password: "sharon",
  id: 19,
};
const Eric = {
  name: "Eric",
  email: "eric",
  password: "eric",
  id: 20,
};

async function CreateSample(userId: number) {
  // Create a new project named My Project
  const [insertData] = await pool.query<ResultSetHeader>(
    "INSERT INTO project (title, administratorId) VALUES (?, ?)",
    ["My Project", Director.id]
  );
  const projectId = insertData.insertId;
  // Invite Jane, Mary, Rachel, Tom, Sharon, and Eric to the project
  await pool.query<ResultSetHeader>(
    "INSERT INTO member (projectId, userId) VALUES (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?)",
    [
      projectId,
      Jane.id,
      projectId,
      Mary.id,
      projectId,
      Rachel.id,
      projectId,
      Tom.id,
      projectId,
      Sharon.id,
      projectId,
      Eric.id,
      projectId,
      userId,
    ]
  );

  // Upload videos
  const videos = [
    {
      title: "Waaking",
      description: "Waaking video for the winter competition",
      url: "https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733499898322-480529989.mp4",
      version: "2024-12-06 15:45:33",
      likes: 3,
    },
    {
      title: "Waaking",
      description: "Waaking video for the winter competition",
      url: "https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733500296562-498101394.mp4",
      version: "2024-12-08 15:53:48",
      likes: 5,
    },
  ];

  const video1 = videos[0];
  const video2 = videos[1];
  const [videoData] = await pool.query<ResultSetHeader>(
    "INSERT INTO video (version, title, description, uploaderId, projectId, videoUrl, likes) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      video1.version,
      video1.title,
      video1.description,
      Director.id,
      projectId,
      video1.url,
      video1.likes,
    ]
  );
  const videoId = videoData.insertId;
  await pool.query<ResultSetHeader>(
    "INSERT INTO video (id, version, title, description, uploaderId, projectId, videoUrl, likes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      videoId,
      video2.version,
      video2.title,
      video2.description,
      Director.id,
      projectId,
      video2.url,
      video2.likes,
    ]
  );

  // Add comments
  const query = `INSERT INTO comment (videoId, version, start, end, userId, content, likes, modifiedAt) VALUES 
  (?,'2024-12-06 15:45:33','0:22','0:24',13,'@Tom right leg needs to be more bended than left leg',0,'2024-12-09 06:06:13'),
(?,'2024-12-06 15:45:33','0:23','0:25',13,'Eric face angle is different from others',0,'2024-12-09 06:18:33'),
(?,'2024-12-06 15:45:33','0:49','0:50',13,'@Mary too fast',1,'2024-12-09 07:44:05'),
(?,'2024-12-06 15:45:33','0:37','0:38',13,'@Tom @Sharon arm height is different',2,'2024-12-09 08:04:32'),
(?,'2024-12-06 15:45:33','0:14','0:15',13,'@Sharon need to move head',0,'2024-12-09 08:08:49'),
(?,'2024-12-06 15:45:33','1:30','1:31',13,'@Jane @Sharon #FootLift timing different',3,'2024-12-09 11:55:19'),
(?,'2024-12-06 15:45:33','1:53','1:58',13,'@Tom #HandOnWaistPose mistake',0,'2024-12-09 11:38:19'),
(?,'2024-12-06 15:45:33','1:59','2:2',13,'@Mary center not aligned',1,'2024-12-09 11:39:43'),
(?,'2024-12-06 15:45:33','3:27','3:31',13,'@Sharon @Jane Timing is delayed',1,'2024-12-09 11:44:40'),
(?,'2024-12-06 15:45:33','3:35','3:37',13,'@Rachel head returning time too fast',0,'2024-12-09 11:45:43'),
(?,'2024-12-08 15:53:48','1:56','1:58',13,'@Tom #HandOnWaistPose Fixed!',0,'2024-12-09 11:52:08'),
(?,'2024-12-08 15:53:48','1:32','1:32',13,'@Jane @Sharon #FootLift timing still different',3,'2024-12-09 11:55:03'),
(?,'2024-12-06 15:45:33','0:34','0:40',16,'Love this part!',5,'2024-12-09 11:58:18'),
(?,'2024-12-06 15:45:33','2:49','2:51',16,'Nice timing with music',4,'2024-12-09 12:00:11'),
(?,'2024-12-06 15:45:33','1:10','1:12',15,'@Sharon nice solo',0,'2024-12-09 12:02:24'),
(?,'2024-12-08 15:53:48','1:36','1:41',15,'@Mary so pretty',5,'2024-12-09 12:03:56'),
(?,'2024-12-06 15:45:33','1:38','1:43',20,'Timing is great',1,'2024-12-09 12:05:14'),
(?,'2024-12-08 15:53:48','0:12','0:16',20,'Nice moves everyone!',1,'2024-12-09 12:06:38');`;
  const videoIds = Array(18).fill(videoId);
  const [insertResult] = await pool.query<ResultSetHeader>(query, videoIds);
  const commentId = insertResult.insertId;

  //// Add replies
  // Add tags
  const commentTags = [
    {
      name: "FootLift",
      projectId: projectId,
      videoId: videoId,
      version: video1.version,
      commentId: commentId + 5,
    },
    {
      name: "FootLift",
      projectId: projectId,
      videoId: videoId,
      version: video2.version,
      commentId: commentId + 11,
    },
    {
      name: "HandOnWaistPose",
      projectId: projectId,
      videoId: videoId,
      version: video1.version,
      commentId: commentId + 6,
    },
    {
      name: "HandOnWaistPose",
      projectId: projectId,
      videoId: videoId,
      version: video2.version,
      commentId: commentId + 10,
    },
  ];
  await pool.query<ResultSetHeader>(
    "INSERT INTO comment_tag (name, projectId, videoId, version, commentId) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)",
    [
      commentTags[0].name,
      commentTags[0].projectId,
      commentTags[0].videoId,
      commentTags[0].version,
      commentTags[0].commentId,
      commentTags[1].name,
      commentTags[1].projectId,
      commentTags[1].videoId,
      commentTags[1].version,
      commentTags[1].commentId,
      commentTags[2].name,
      commentTags[2].projectId,
      commentTags[2].videoId,
      commentTags[2].version,
      commentTags[2].commentId,
      commentTags[3].name,
      commentTags[3].projectId,
      commentTags[3].videoId,
      commentTags[3].version,
      commentTags[3].commentId,
    ]
  );
}

export { CreateSample };
