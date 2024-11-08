import { UserT } from "./user";

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
