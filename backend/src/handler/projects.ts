import { Request, Response } from "express";
import { pool } from "../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import dotenv from "dotenv";

async function GetProject(req: Request, res: Response) {
  const projectId = req.params.projectId;

  // get project
  const [projectData] = await pool.query<RowDataPacket[]>(
    "select * from project where id = ?",
    [projectId]
  );
  if (projectData.length === 0) {
    return res.status(404).json({ message: "Project not found" });
  }
  const project = projectData[0];

  const [administratorData] = await pool.query<RowDataPacket[]>(
    "select * from user where id = ?",
    [project.administratorId]
  );
  const administrator = {
    id: administratorData[0].id,
    name: administratorData[0].name,
    profileUrl: administratorData[0].profilePicture,
  };

  const [memberData] = await pool.query<RowDataPacket[]>(
    `select * from member
      inner join user on member.userId = user.id
      where projectId = ?`,
    [projectId]
  );
  const members = memberData.map((row) => {
    return {
      id: row.id,
      name: row.name,
      profileUrl: row.profilePicture,
    };
  });

  const [videosData] = await pool.query<RowDataPacket[]>(
    `
      select * from video
      inner join (select id, MAX(version) as version from video
      where projectId = ?
      group by id) as latest
      on video.id = latest.id and video.version = latest.version`,
    [projectId]
  );
  const videos = videosData.map((row) => {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      videoUrl: row.videoUrl,
      version: row.version,
    };
  });

  res.status(200).json({
    project: {
      id: project.id,
      title: project.title,
      administrator: administrator,
      members: members,
      videos: videos,
    },
  });
}

async function GetProjects(req: Request, res: Response) {
  const userId = req.user!.id;

  // get project
  const [projectIdsData] = await pool.query<RowDataPacket[]>(
    "select projectId from member where userId = ?",
    [userId]
  );
  const projectIds = projectIdsData.map((row) => row.projectId);

  let projects = [];
  for (const projectId of projectIds) {
    const [projectData] = await pool.query<RowDataPacket[]>(
      "select * from project where id = ?",
      [projectId]
    );
    const project = projectData[0];

    const [administratorData] = await pool.query<RowDataPacket[]>(
      "select * from user where id = ?",
      [project.administratorId]
    );
    const administrator = {
      id: administratorData[0].id,
      name: administratorData[0].name,
      profileUrl: administratorData[0].profilePicture,
    };

    const [memberData] = await pool.query<RowDataPacket[]>(
      `select * from member
      inner join user on member.userId = user.id
      where projectId = ?`,
      [projectId]
    );
    const members = memberData.map((row) => {
      return {
        id: row.id,
        name: row.name,
        profileUrl: row.profilePicture,
      };
    });

    const [videosData] = await pool.query<RowDataPacket[]>(
      `
      select * from video
      inner join (select id, MAX(version) as version from video
      where projectId = ?
      group by id) as latest
      on video.id = latest.id and video.version = latest.version`,
      [projectId]
    );
    const videos = videosData.map((row) => {
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        videoUrl: row.videoUrl,
        version: row.version,
      };
    });

    projects.push({
      id: project.id,
      title: project.title,
      name: project.name,
      description: project.description,
      administrator: administrator,
      members: members,
      videos: videos,
    });
  }
  res.status(200).json({ projects: projects });
}

async function AddProject(req: Request, res: Response) {
  const userId = req.user!.id;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  // create project
  const [resultData] = await pool.query<ResultSetHeader>(
    "insert into project (title, administratorId) values (?, ?)",
    [title, userId]
  );
  const projectId = resultData.insertId;

  // add user as member
  await pool.query("insert into member (projectId, userId) values (?, ?)", [
    projectId,
    userId,
  ]);

  // get created project
  const [projectData] = await pool.query<RowDataPacket[]>(
    "select * from project where id = ?",
    [projectId]
  );
  const project = projectData[0];
  
  const [administratorData] = await pool.query<RowDataPacket[]>(
    "select * from user where id = ?",
    [project.administratorId]
  );
  const administrator = {
    id: administratorData[0].id,
    name: administratorData[0].name,
    profileUrl: administratorData[0].profilePicture,
  };

  res.status(201).json({
    message: "Project created successfully",
    project: {
      id: project.id,
      title: project.title,
      administrator: administrator,
      members: [userId],
      videos: [],
    },
  });
}

async function UpdateProject(req: Request, res: Response) {
  const userId = req.user!.id;
  const projectId = req.params.projectId;
  const { title, administrator } = req.body;

  // check if user is administrator
  const [projectData] = await pool.query<RowDataPacket[]>(
    "select * from project where id = ? and administratorId = ?",
    [projectId, userId]
  );
  if (projectData.length === 0) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (title) {
    // update title
    await pool.query("update project set title = ? where id = ?", [
      title,
      projectId,
    ]);
  }

  if (administrator) {
    // update administrator
    await pool.query("update project set administratorId = ? where id = ?", [
      administrator,
      projectId,
    ]);
  }

  // get project info
  const [newProjectData] = await pool.query<RowDataPacket[]>(
    "select * from project where id = ?",
    [projectId]
  );
  const project = newProjectData[0];

  const [administratorData] = await pool.query<RowDataPacket[]>(
    "select * from user where id = ?",
    [project.administratorId]
  );
  const newAdministrator = {
    id: administratorData[0].id,
    name: administratorData[0].name,
    profileUrl: administratorData[0].profilePicture,
  };

  const [memberData] = await pool.query<RowDataPacket[]>(
    `select * from member
      inner join user on member.userId = user.id
      where projectId = ?`,
    [projectId]
  );
  const members = memberData.map((row) => {
    return {
      id: row.id,
      name: row.name,
      profileUrl: row.profilePicture,
    };
  });

  const [videosData] = await pool.query<RowDataPacket[]>(
    "select * from video where projectId = ?",
    [projectId]
  );
  const videos = videosData.map((row) => {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      videoUrl: row.videoUrl,
      createdAt: row.createdAt,
    };
  });

  res.status(200).json({
    message: "Project updated successfully",
    project: {
      id: project.id,
      title: project.title,
      administrator: newAdministrator,
      members: members,
      videos: videos,
    },
  });
}

async function DeleteProject(req: Request, res: Response) {
  const userId = req.user!.id;
  const projectId = req.params.projectId;

  // check if user is administrator
  const [projectData] = await pool.query<RowDataPacket[]>(
    "select * from project where id = ? and administratorId = ?",
    [projectId, userId]
  );
  if (projectData.length === 0) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // delete project
  await pool.query("delete from project where id = ?", [projectId]);

  res.status(200).json({ message: "Project deleted successfully" });
}

async function JoinProject(req: Request, res: Response) {
  const user = req.user!;
  const encoded = req.params.projectCode;
  dotenv.config();

  if (!encoded) {
    return res.status(400).json({ message: "Project code is required" });
  }

  // decode project code from base64
  const buff = Buffer.from(encoded, "base64");
  const decodedProjectCode = buff.toString("utf-8");
  const projectId =
    parseInt(decodedProjectCode) - parseInt(process.env.CODE_SALT!);

  // get project
  const [projectData] = await pool.query<RowDataPacket[]>(
    "select * from project where id = ?",
    [projectId]
  );
  if (projectData.length === 0) {
    return res.status(404).json({ message: "Project not found" });
  }

  // check if user is already a member
  const [memberData] = await pool.query<RowDataPacket[]>(
    "select * from member where projectId = ? and userId = ?",
    [projectData[0].id, user.id]
  );
  if (memberData.length > 0) {
    return res.status(409).json({ message: "User is already a member" });
  }

  const [result] = await pool.query<ResultSetHeader>(
    "insert into member (projectId, userId) values (?, ?)",
    [projectData[0].id, user.id]
  );

  if (result.affectedRows === 0) {
    return res.status(500).json({ message: "Failed to join project" });
  }

  res.status(200).json({ message: "Joined project successfully" });
}

async function GetProjectCode(req: Request, res: Response) {
  dotenv.config();
  const userId = req.user!.id;
  const projectId = req.params.projectId;

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  const number = parseInt(projectId) + parseInt(process.env.CODE_SALT!);
  const projectCode = Buffer.from(number.toString()).toString("base64");
  res.status(200).json({ project: projectId, projectCode: projectCode });
}

async function GetTagRelatedVideos(req: Request, res: Response) {
  const projectId = req.params.projectId;
  const tag = req.params.tagName;

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }
  if (!tag) {
    return res.status(400).json({ message: "Tag is required" });
  }

  const [videoData] = await pool.query<RowDataPacket[]>(
    `
    select distinct video.id as id, title from video
    inner join tag on video.id = tag.videoId
    where tag.projectId = ? and name = ?`,
    [projectId, tag]
  );

  const videos = videoData.map((row) => {
    return {
      id: row.id,
      title: row.title,
      version: row.version,
    };
  });

  res.status(200).json({
    tag,
    project: projectId,
    related: videos,
  });
}

async function GetTagRelated(req: Request, res: Response) {
  const projectId = req.params.projectId;
  const tag = req.params.tagName;

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }
  if (!tag) {
    return res.status(400).json({ message: "Tag is required" });
  }

  const [commentTagData] = await pool.query<RowDataPacket[]>(
    `
    select comment_tag.projectId as projectId, name, comment_tag.videoId as videoId, comment_tag.version as version, content, title from comment_tag
    inner join comment on comment_tag.commentId = comment.id
    inner join video on comment.videoId = video.id and comment_tag.version = video.version
    where comment_tag.projectId = ? and name = ?
    `,
    [projectId, tag]
  );

  const comments = commentTagData.map((row) => {
    return {
      project: row.projectId,
      id: row.videoId,
      title: row.title,
      version: row.version,
      content: row.content,
    };
  });

  const [replyTagData] = await pool.query<RowDataPacket[]>(
    `
    select reply_tag.projectId as projectId, name, reply_tag.videoId as videoId, reply_tag.version as version, reply.content as content, title from reply_tag
    inner join reply on reply_tag.replyId = reply.id
    inner join comment on reply.commentId = comment.id
    inner join video on comment.videoId = video.id and reply_tag.version = video.version
    where reply_tag.projectId = ? and name = ?
    `,
    [projectId, tag]
  );

  const replies = replyTagData.map((row) => {
    return {
      project: row.projectId,
      id: row.videoId,
      title: row.title,
      version: row.version,
      content: row.content,
    };
  });

  const [relatedData] = await pool.query<RowDataPacket[]>(
    `
    select distinct video.id as id, title from video
    inner join comment_tag on video.id = comment_tag.videoId
    where comment_tag.projectId = ? and name = ?
    union
    select distinct video.id as id, title from video
    inner join reply_tag on video.id = reply_tag.videoId
    where reply_tag.projectId = ? and name = ?
    `,
    [projectId, tag, projectId, tag]
  );

  const related = relatedData.map((row) => {
    return {
      id: row.id,
      title: row.title,
    };
  });

  res.status(200).json({
    tag,
    project: projectId,
    comments: comments,
    replies: replies,
    related: related,
  });
}

export {
  GetProject,
  GetProjects,
  AddProject,
  UpdateProject,
  JoinProject,
  GetProjectCode,
  DeleteProject,
  GetTagRelated,
};
