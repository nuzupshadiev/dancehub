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
  replies: ReplyT[];
  modifiedAt: string;
};
export type ReplyT = {
  id: string;
  commentId: string;
  user: {
    id: string;
    name: string;
    profileUrl: string;
  };
  content: string;
  likes: number;
  modifiedAt: string;
};
export type VideoT = {
  project: string;
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

type ReplyResponseT = {
  message: string;
  reply: ReplyT;
};

export default class Video {
  data: VideoT;
  constructor(data: VideoT) {
    this.data = data;
  }
  update(user: UserContextT["user"], payload: FormData): Promise<Video> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<VideoResponseT>("put", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${this.data.id}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      data: payload,
      params: {
        videoId: this.data.id,
        userId: user.data.id,
      },
    }).then((resp) => new Video(resp.data.video));
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

  static getVideoVersion(
    id: string,
    version: string,
    user: UserContextT["user"]
  ): Promise<Video> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<VideoT>("get", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${id}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        videoId: id,
        version: version,
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

  static deleteVideo(
    id: string,
    user: UserContextT["user"]
  ): Promise<AxiosResponse> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request("delete", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${id}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        videoId: id,
      },
    });
  }

  static leaveComment(
    payload: {
      content: string;
      start: string;
      end: string;
      tags: string[];
    },
    videoId: string,
    user: UserContextT["user"],
    version?: string
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
        tags: payload.tags,
      },
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        videoId: videoId,
        version: version,
      },
    }).then((resp) => {
      return resp.data;
    });
  }

  static getComments(
    videoId: string,
    user: UserContextT["user"],
    version?: string
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
        version: version,
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

  static replyToComment(
    user: UserContextT["user"],
    commentId: string,
    videoId: string,
    replyText: string,
    tags: string[]
  ): Promise<ReplyT> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<ReplyResponseT>("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${videoId}/comments/${commentId}/replies`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        videoId: videoId,
      },
      data: {
        content: replyText,
        tags: tags,
      },
    }).then((resp) => resp.data.reply);
  }
  static deleteComment(
    user: UserContextT["user"],
    commentId: string,
    videoId: string
  ): Promise<AxiosResponse> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request("delete", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${videoId}/comments/${commentId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        commentId: commentId,
      },
    });
  }

  static editComment(
    user: UserContextT["user"],
    commentId: string,
    videoId: string,
    payload: {
      content: string;
      start: string;
      end: string;
      oldtags: string[];
      newtags: string[];
    }
  ): Promise<CommentT> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<CommentCreateT>("put", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${videoId}/comments/${commentId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        commentId: commentId,
        videoId: videoId,
      },
      data: {
        content: payload.content,
        start: payload.start,
        end: payload.end,
      },
    }).then((resp) => resp.data.comment);
  }

  static likeReply(
    user: UserContextT["user"],
    commentId: string,
    videoId: string,
    replyId: string
  ): Promise<AxiosResponse> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${videoId}/comments/${commentId}/replies/${replyId}/like`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        commentId: commentId,
        videoId: videoId,
        replyId: replyId,
      },
    });
  }
  static unlikeReply(
    user: UserContextT["user"],
    commentId: string,
    videoId: string,
    replyId: string
  ): Promise<AxiosResponse> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${videoId}/comments/${commentId}/replies/${replyId}/unlike`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        commentId: commentId,
        videoId: videoId,
        replyId: replyId,
      },
    });
  }
  static updateReply(
    user: UserContextT["user"],
    commentId: string,
    videoId: string,
    replyId: string,
    content: string,
    tags: string[]
  ): Promise<ReplyT> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request<ReplyResponseT>("put", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${videoId}/comments/${commentId}/replies/${replyId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        commentId: commentId,
        videoId: videoId,
      },
      data: {
        content: content,
        tags: tags,
      },
    }).then((resp) => resp.data.reply);
  }

  static deleteReply(
    user: UserContextT["user"],
    commentId: string,
    videoId: string,
    replyId: string
  ): Promise<AxiosResponse> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request("delete", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}videos/${videoId}/comments/${commentId}/replies/${replyId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        commentId: commentId,
      },
    });
  }
}
