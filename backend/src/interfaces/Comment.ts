export interface Comment {
  id: string;
  videoId: string;
  version: Date;
  start: number;
  end: number;
  user: {
    id: string;
    username: string;
    email: string;
  };
  content: string;
  likes: number;
  likedBy: string[];
  modifiedAt: Date;
}

export const sampleComment: Comment = {
  id: "c001",
  videoId: "v001",
  version: new Date(),
  start: 0,
  end: 10,
  user: {
    id: "u001",
    username: "Seyeon Kim",
    email: "tpdus2155@kaist.ac.kr",
  },
  content: "This is a sample comment.",
  likes: 0,
  likedBy: [],
  modifiedAt: new Date(),
};
