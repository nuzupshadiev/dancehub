export interface Video {
  id: string;
  title: string;
  description: string;
  uploader: string;
  videoUrl: string;
  thumbnailUrl: string;
  likes: number;
  versions: Date[];
  version: Date;
}

export const sampleVideo: Video = {
  id: "v001",
  title: "Sample Video",
  description: "This is a sample video.",
  uploader: "u001",
  videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
  thumbnailUrl: "https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg",
  likes: 0,
  versions: [new Date()],
  version: new Date(),
};
