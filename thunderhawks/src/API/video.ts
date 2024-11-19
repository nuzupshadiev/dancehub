import { Comment } from "./../../../backend/src/interfaces/Comment";
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
  likedBy: UserT[];
  versions: string[];
  version: string;
  comments: CommentT[];
};
type VideosResponseT = {
  message: string;
  videos: VideoT[];
};
type VideoCreateT = {
  title: string;
  description: string;
  videoFile: FormData;
  projectId: string;
};
type CommentCreateT = {
  message: string;
  comment: CommentT;
};
type getCommentsResponseT = {
  message: string;
  comments: CommentT[];
};
type VideoResponseT = {
  message: string;
  video: VideoT;
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
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}video/${this.data.id}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        userId: user.data.id,
      },
    });
  }

  static getVideos(user: UserContextT["user"]): Promise<Video[]> {
    if (!user) {
      return Promise.resolve([]);
    }

    return Endpoint.request<VideosResponseT>("get", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        userId: user.data.id,
      },
    }).then((resp) => resp.data.videos.map((video) => new Video(video)));
  }

  static getVideo(id: string, user: UserContextT["user"]): Promise<Video> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<VideoT>("get", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${id}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        userId: user.data.id,
      },
    }).then((resp) => new Video(resp.data));
  }

  static createVideo(
    payload: FormData,
    user: UserContextT["user"]
  ): Promise<Video> {
    if (!user) {
      return Promise.reject(new Error("No user provided"));
    }

    return Endpoint.request<VideoResponseT>("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/`,
      data: payload,
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      },
    }).then((resp) => new Video(resp.data.video));
  }

  static leaveComment(
    payload: {
      content: string;
      start: string;
      end: string;
    },
    videoId: string,
    user: UserContextT["user"]
  ): Promise<CommentCreateT> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<CommentCreateT>("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${videoId}/comments`,
      data: {
        content: payload.content,
        start: payload.start,
        end: payload.end,
      },
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        videoId: videoId,
      },
    }).then((resp) => {
      return resp.data;
    });
  }

  static getComments(
    videoId: string,
    user: UserContextT["user"]
  ): Promise<CommentT[]> {
    if (!user) {
      return Promise.resolve([]);
    }

    return Endpoint.request<getCommentsResponseT>("get", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${videoId}/comments`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        videoId: videoId,
      },
    }).then((resp) => resp.data.comments);
  }

  static likeComment(
    user: UserContextT["user"],
    commentId: string,
    videoId: string
  ): Promise<AxiosResponse> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${videoId}/comments/${commentId}/like`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        commentId: commentId,
        videoId: videoId,
      },
    });
  }

  static unlikeComment(
    user: UserContextT["user"],
    commentId: string,
    videoId: string
  ): Promise<AxiosResponse> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${videoId}/comments/${commentId}/unlike`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        commentId: commentId,
        videoId: videoId,
      },
    });
  }

  static likeVideo(
    user: UserContextT["user"],
    videoId: string
  ): Promise<AxiosResponse> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${videoId}/like`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        videoId: videoId,
      },
    });
  }

  static unlikeVideo(
    user: UserContextT["user"],
    videoId: string
  ): Promise<AxiosResponse> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${videoId}/unlike`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        videoId: videoId,
      },
    });
  }
}
