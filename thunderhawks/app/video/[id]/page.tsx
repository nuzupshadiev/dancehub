"use client";
import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import CommentsSection from "./comments";
import DescriptionSection from "./description";

import * as VideoAPI from "@/src/API/video";
import { UserContext } from "@/utils/user-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
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

  if (!video) {
    return <p>No video was found with this id</p>;
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col gap-2">
        <ReactPlayer
          url={video.data.videoUrl}
          width={"100%"}
          height={"100%"}
          controls
        />
        <div className="flex flex-row justify-between max-w-7xl">
          <h1 className="text-xl font-bold">{video.data.title}</h1>
          <div
            className="flex flex-row cursor-pointer gap-2 items-center"
            role="button"
            tabIndex={0}
            onClick={handleLike}
          >
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
        <CommentsSection video={video} />
      </div>
    </div>
  );
}
export default VideoPage;
