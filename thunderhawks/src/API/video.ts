import { UserContextT } from "@/utils/user-context";
import { UserT } from "./user";
import { AxiosResponse } from "axios";
import { Endpoint } from "./endpoint";

export type CommentT = {
  id: string;
  videoId: string;
  version: string;
  start: string;
  end: string;
  user: UserT;
  content: string;
  likes: number;
  likedBy: UserT[];
  modifiedAt: string;
};

export type VideoT = {
  id: string;
  title: string;
  description: string;
  uploader: UserT;
  videoUrl: string;
  thumbnailUrl: string;
  likes: number;
  versions: string[];
  version: string;
  comments: CommentT[];
};
type VideosResponseT = {
  message: string;
  videos: VideoT[];
};
type VideoResponseT = {
  message: string;
  video: VideoT;
};
type VideoCreateT = {
  title: string;
  description: string;
  videoFile: File;
  projectId: string;
  videoThumbnail: File;
};

export default class Video {
  data: VideoT;
  constructor(data: VideoT) {
    this.data = data;
  }
  delete(user: UserContextT["user"]): Promise<AxiosResponse> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request("delete", {
      url: `video/${this.data.id}`,
      params: {
        token: user.token,
      },
    });
  }

  static getVideos(user: UserContextT["user"]): Promise<Video[]> {
    if (!user) {
      return Promise.resolve([]);
    }

    return Endpoint.request<VideosResponseT>("get", {
      url: "/api/videos/",
      params: {
        token: user.token,
      },
    }).then((resp) => resp.data.videos.map((video) => new Video(video)));
  }

  static getVideo(id: string, user: UserContextT["user"]): Promise<Video> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<VideoResponseT>("get", {
      url: `/api/projects/${id}`,
      params: {
        token: user.token,
      },
    }).then((resp) => new Video(resp.data.video));
  }

  static createVideo(
    payload: VideoCreateT,
    user: UserContextT["user"]
  ): Promise<Video> {
    // if (!user) {
    //   return Promise.reject("No user provided");
    // }

    // return Endpoint.request<VideoResponseT>("post", {
    //   url: "/api/videos/",
    //   data: payload,
    //   params: {
    //     token: user.token,
    //   },
    // }).then((resp) => new Video(resp.data.video));

    return Promise.resolve(
      new Video({
        id: "1",
        title: payload.title,
        description: payload.description,
        uploader: {
          id: "1",
          name: "John Doe",
          profilePicture: "https://via.placeholder.com/150",
          username: "johndoe",
        },
        videoUrl: URL.createObjectURL(payload.videoFile),
        thumbnailUrl: URL.createObjectURL(payload.videoThumbnail),
        likes: 0,
        versions: ["1"],
        version: "1",
        comments: [],
      })
    );
  }
}
