"use client";
import React, { useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import CommentsSection from "./comments";
import DescriptionSection from "./description";

import * as VideoAPI from "@/src/API/video";
import { UserContext } from "@/utils/user-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { Select, SelectItem, Selection } from "@nextui-org/react";
import { OnProgressProps } from "react-player/base";
function VideoPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { user } = React.useContext(UserContext);
  const [video, setVideo] = React.useState<VideoAPI.default | null>(null);
  const [isLiked, setIsLiked] = React.useState(false);
  const [likes, setLikes] = React.useState(0);
  const [isFiltered, setIsFiltered] = React.useState(false);
  const [secondsElapsed, setSecondsElapsed] = React.useState(0);

  const playerRef = useRef(null);

  const router = useRouter();

  React.useEffect(() => {
    if (!user) {
      return;
    }
    VideoAPI.default
      .getVideo(params.id, user)
      .then((video) => {
        setVideo(video);
        setLikes(video.data.likes);
        video.data.likedBy.forEach((likedBy) => {
          if (Number(likedBy.id) === user?.data.id) {
            setIsLiked(true);
          }
        });
      })
      .catch((err) => {
        setVideo(null);
      });
  }, [params.id, user]);

  const handleLike = React.useCallback(() => {
    if (!user || !video) {
      return;
    }
    if (isLiked) {
      VideoAPI.default
        .unlikeVideo(user, video?.data.id)
        .then(() => {
          setIsLiked(false);
          setLikes((prev) => prev - 1);
        })
        .catch(() => {});
    } else {
      VideoAPI.default
        .likeVideo(user, video?.data.id)
        .then(() => {
          setIsLiked(true);
          setLikes((prev) => prev + 1);
        })
        .catch(() => {});
    }
  }, [user, video, isLiked]);

  const goToTime = React.useCallback((time: string) => {
    const [minutes, seconds] = time.split(":").map(Number);
    const goToTimeSeconds = minutes * 60 + seconds;

    if (playerRef.current) {
      // @ts-ignore
      playerRef.current.seekTo(goToTimeSeconds, "seconds");
    }
  }, []);

  const handleSelectionChange = React.useCallback((value: Selection) => {
    setIsFiltered((prev) => !prev);
  }, []);

  const handleOnProgress = React.useCallback((state: OnProgressProps) => {
    setSecondsElapsed(state.playedSeconds);
  }, []);

  if (!user) {
    return <p>You need to be logged in to view this page</p>;
    // router.push("/login");
  }
  if (!video) {
    return <p>No video was found with this id</p>;
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col gap-2">
        <ReactPlayer
          ref={playerRef}
          url={video.data.videoUrl}
          width={"100%"}
          height={"100%"}
          controls
          onProgress={handleOnProgress}
        />
        <div className="flex flex-row justify-between max-w-7xl">
          <h1 className="text-xl font-bold">{video.data.title}</h1>
          <div
            className="flex flex-row cursor-pointer gap-2 items-center"
            role="button"
            tabIndex={0}
            onClick={handleLike}
          >
            <Select
              size="sm"
              variant="bordered"
              placeholder="Filter comments"
              className="w-40"
              onSelectionChange={handleSelectionChange}
            >
              <SelectItem key={"me"}>{`@${user.data.name}`}</SelectItem>
            </Select>
            {isLiked ? (
              <FontAwesomeIcon icon={faHeartSolid} color="red" />
            ) : (
              <FontAwesomeIcon icon={faHeart} />
            )}
            <p>{likes}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col max-w-7xl">
        <DescriptionSection video={video} />
        <CommentsSection
          secondsElapsed={secondsElapsed}
          video={video}
          goToTime={goToTime}
          isFiltered={isFiltered}
        />
      </div>
    </div>
  );
}
export default VideoPage;
