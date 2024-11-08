"use client";
import React, { useEffect } from "react";
import Video from "next-video";

import CommentsSection from "./comments";

import getStarted from "@/videos/get-started.mp4.json";
import DescriptionSection from "./description";
import { VideoT } from "@/src/API/video";
import { testProjects } from "@/src/testdata/testdata";

function VideoPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const [video, setVideo] = React.useState<VideoT | null>(
    testProjects[0].videos[0]
  );

  // React.useEffect(() => {
  //   setVideo(
  //     testProjects.find((video) => video.id === params.id) || null
  //   );
  // }, [params.id]);

  if (!video) {
    return <p>No video was found with this id</p>;
  }

  return (
    <div className="flex flex-col p-4 gap-2">
      <Video className="rounded-lg" src={getStarted} />
      <h1 className="text-xl font-bold">{video.title}</h1>
      <DescriptionSection video={video} />
      <CommentsSection comments={video.comments} />
    </div>
  );
}
export default VideoPage;
