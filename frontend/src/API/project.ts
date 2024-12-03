import { title } from "./../../components/primitives";
import { UserContextT } from "@/utils/user-context";
import { Endpoint } from "./endpoint";
import { UserT } from "./user";
import { VideoT } from "./video";
import { AxiosResponse } from "axios";

type ProjectsResponseT = {
  projects: ProjectT[];
};
type ProjectResponseT = {
  message: string;
  project: ProjectT;
};
type ProjectCodeResponseT = {
  message: string;
};
export type TagVideoT = {
  id: string;
  title: string;
  version: string;
};
export type TagVideosT = TagVideoT[];

export type ProjectT = {
  id: string;
  title: string;
  administrator: UserT;
  members: UserT[];
  videos: VideoT[];
};
export type ProjectVideoT = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
};
export type ProjectVideosT = {
  totalVideos: number;
  project: string;
  title: string;
  videos: ProjectVideoT[];
};
export default class Project {
  data: ProjectT;
  constructor(data: ProjectT) {
    this.data = data;
  }
  delete(user: UserContextT["user"]): Promise<AxiosResponse> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request("delete", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}projects/${this.data.id}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
  update(
    user: UserContextT["user"],
    payload: {
      title?: string;
      administrator?: string;
    }
  ): Promise<Project> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<ProjectT>("put", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}project/${this.data.id}`,
      data: payload,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then((resp) => new Project(resp.data));
  }

  static getProjects(user: UserContextT["user"]): Promise<Project[]> {
    if (!user) {
      return Promise.resolve([]);
    }

    return Endpoint.request<ProjectsResponseT>("get", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}projects/`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        userId: user.data.id,
      },
    }).then((resp) =>
      resp.data.projects.map((project) => new Project(project))
    );
  }

  static createProject(
    projectName: string,
    user: UserContextT["user"]
  ): Promise<Project> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<ProjectResponseT>("post", {
      data: {
        title: projectName,
      },
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}projects/`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        userId: user.data.id,
      },
    }).then((resp) => new Project(resp.data.project));
  }

  static joinProject(
    joinCode: string,
    user: UserContextT["user"]
  ): Promise<AxiosResponse> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<ProjectCodeResponseT>("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}projects/code/${joinCode}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        projectCode: joinCode,
      },
    });
  }

  static getProjectVideos(
    projectId: string,
    user: UserContextT["user"]
  ): Promise<ProjectVideosT> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<ProjectVideosT>("get", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/list/${projectId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        userId: user.data.id,
      },
    }).then((resp) => resp.data);
  }

  static getProjectCode(
    projectId: string,
    user: UserContextT["user"]
  ): Promise<{
    project: "projectId";
    projectCode: "projectCode";
  }> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<{
      project: "projectId";
      projectCode: "projectCode";
    }>("get", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}projects/code/${projectId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        projectId: projectId,
      },
    }).then((resp) => resp.data);
  }

  static deleteProject(
    projectId: string,
    user: UserContextT["user"]
  ): Promise<AxiosResponse> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request("delete", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}projects/${projectId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
  static updateProject(
    projectId: string,
    user: UserContextT["user"],
    payload: {
      title?: string;
      administrator?: string;
    }
  ): Promise<Project> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<ProjectResponseT>("put", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}projects/${projectId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      data: payload,
    }).then((resp) => new Project(resp.data.project));
  }

  static getProject(
    user: UserContextT["user"],
    projectId: string
  ): Promise<Project> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<ProjectResponseT>("get", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}projects/${projectId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then((resp) => new Project(resp.data.project));
  }

  static getTagRelatedVideos(
    user: UserContextT["user"],
    projectId: string,
    tagName: string
  ): Promise<{
    project: string;
    title: string;
    totalVideos: number;
    videos: { desription: string; id: string; title: string }[];
  }> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<{
      project: string;
      title: string;
      totalVideos: number;
      videos: { desription: string; id: string; title: string }[];
    }>("get", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/list/${projectId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        userId: user.data.id,
        tagName: tagName,
      },
    }).then((resp) => {
      return resp.data;
    });
  }
}
