import { UserT } from "./user";
import { VideoT } from "./video";

export type ProjectT = {
  id: string;
  title: string;
  administrator: string;
  members: UserT[];
  videos: VideoT[];
};
