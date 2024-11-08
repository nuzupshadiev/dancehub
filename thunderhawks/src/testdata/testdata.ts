import { ProjectT } from "../API/project";
import { UserT } from "../API/user";
import { CommentT, VideoT } from "../API/video";

// Sample Users
const user1: UserT = {
  id: "user1",
  name: "Alice Johnson",
  username: "alice_j",
  profilePicture: "https://example.com/profile/alice.jpg",
};

const user2: UserT = {
  id: "user2",
  name: "Bob Smith",
  username: "bob_s",
  profilePicture: "https://example.com/profile/bob.jpg",
};

const user3: UserT = {
  id: "user3",
  name: "Charlie Lee",
  username: "charlie_l",
  profilePicture: "https://example.com/profile/charlie.jpg",
};

// Sample Comments
const comment1: CommentT = {
  id: "comment1",
  videoId: "video1",
  version: "v1",
  start: "00:00",
  end: "00:05",
  user: user1,
  content: "Great intro!",
  likes: 3,
  likedBy: [user2, user3],
  modifiedAt: "2024-11-01T12:00:00Z",
};

const comment2: CommentT = {
  id: "comment2",
  videoId: "video1",
  version: "v1",
  start: "01:15",
  end: "01:20",
  user: user2,
  content: "Interesting point here.",
  likes: 2,
  likedBy: [user1],
  modifiedAt: "2024-11-01T12:05:00Z",
};

// Sample Videos
const video1: VideoT = {
  id: "video1",
  title: "Project Overview",
  description: "An overview of the project goals and objectives.",
  uploader: user1,
  videoUrl: "https://example.com/video1.mp4",
  thumbnailUrl:
    "https://marketplace.canva.com/EAFAMirCsX4/2/0/1600w/canva-purple-creative-livestream-youtube-thumbnail-X2eVuOzURSM.jpg",
  likes: 10,
  versions: ["v1", "v2"],
  version: "v2",
  comments: [comment1, comment2],
};

const video2: VideoT = {
  id: "video2",
  title: "Technical Deep Dive",
  description: "An in-depth look at the technical aspects of the project.",
  uploader: user2,
  videoUrl: "https://example.com/video2.mp4",
  thumbnailUrl:
    "https://static-cse.canva.com/blob/1760641/1600w-wK95f3XNRaM.jpg",
  likes: 15,
  versions: ["v1"],
  version: "v1",
  comments: [],
};

// Sample Projects
const project1: ProjectT = {
  id: "project1",
  title: "Project Alpha",
  administrator: user1.name,
  members: [user1, user2, user3],
  videos: [video1, video2],
};

const project2: ProjectT = {
  id: "project2",
  title: "Project Beta",
  administrator: user2.name,
  members: [user2, user3],
  videos: [video1],
};

// Test projects array
export const testProjects: ProjectT[] = [project1, project2];
