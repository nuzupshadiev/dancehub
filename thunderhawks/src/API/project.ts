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
      params: {
        token: user.token,
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
      params: {
        token: user.token,
      },
    }).then((resp) => new Project(resp.data));
  }

  static getProjects(user: UserContextT["user"]): Promise<Project[]> {
    if (!user) {
      return Promise.resolve([]);
    }

    return Endpoint.request<ProjectsResponseT>("get", {
      url: "/api/projects/",
      params: {
        token: user.token,
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
      url: "/api/projects/",
      params: {
        token: user.token,
      },
    }).then((resp) => new Project(resp.data.project));
  }

  static getProject(id: string, user: UserContextT["user"]): Promise<Project> {
    // if (!user) {
    //   return Promise.reject("No user provided");
    // }

    // return Endpoint.request<ProjectResponseT>("get", {
    //   url: `/api/projects/${id}`,
    //   params: {
    //     token: user.token,
    //   },
    // }).then((resp) => new Project(resp.data.project));
    return Promise.resolve(
      new Project({
        id: "1",
        title: "Project 1",
        administrator: "admin",
        members: [],
        videos: [
          {
            id: "1",
            title: "Video 1",
            description: "Description 1",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            thumbnailUrl: "https://via.placeholder.com/150",
            uploader: {
              id: "",
              name: "",
              username: "",
              profilePicture: "",
            },
            likes: 0,
            versions: [],
            version: "",
            comments: [],
          },
        ],
      })
    );
  }

  static joinProject(
    joinCode: string,
    user: UserContextT["user"]
  ): Promise<Project> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<ProjectResponseT>("post", {
      url: `/api/projects/join/${joinCode}`,
      params: {
        token: user.token,
      },
    }).then((resp) => new Project(resp.data.project));
  }
}
