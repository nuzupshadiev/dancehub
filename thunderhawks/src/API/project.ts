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
export type ProjectT = {
  id: string;
  title: string;
  administrator: string;
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
      url: `project/${this.data.id}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        userId: user.data.id,
      },
    });
  }
  update(user: UserContextT["user"], payload: ProjectT): Promise<Project> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<ProjectT>("put", {
      url: `api/project/${this.data.id}`,
      data: payload,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        userId: user.data.id,
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
  ): Promise<Project> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<ProjectResponseT>("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}projects/code/${joinCode}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        projectCode: joinCode,
      },
    }).then((resp) => new Project(resp.data.project));
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
}
