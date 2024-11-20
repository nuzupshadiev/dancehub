"use client";
import React, { useEffect } from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "@nextui-org/react";

import Video, { CommentT } from "@/src/API/video";
import { UserContext } from "@/utils/user-context";

interface CommentProps {
  comment: CommentT;
  video: Video;
  goToTime: (time: string) => void;
}
export default function Comment({ comment, video, goToTime }: CommentProps) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [likes, setLikes] = React.useState(comment.likes);
  const { user } = React.useContext(UserContext);

  useEffect(() => {
    comment.likedBy.forEach((likedBy) => {
      if (Number(likedBy.id) === user?.data.id) {
        setIsLiked(true);
      }
    });
  }, [comment, user]);

  const handleLike = React.useCallback(() => {
    if (!user) {
      return;
    }
    if (isLiked) {
      Video.unlikeComment(user, comment.id, video.data.id)
        .then(() => {
          setIsLiked(false);
          setLikes((prev) => prev - 1);
        })
        .catch(() => {});
    } else {
      Video.likeComment(user, comment.id, video.data.id)
        .then(() => {
          setIsLiked(true);
          setLikes((prev) => prev + 1);
        })
        .catch(() => {});
    }
  }, [isLiked, user, comment, video]);

  const handleGoToTime = React.useCallback((time: string) => {
    goToTime(time);
  }, []);

  return (
    <div className="py-3 shadow-none flex flex-row gap-4 items-start">
      <Avatar src={comment.user.profileUrl} />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{comment.user.name}</p>
          <p className="text-xs text-gray-500">
            {new Date(comment.modifiedAt).toLocaleString()}
          </p>
        </div>
        <p className="text-sm">{comment.content}</p>
        <div className="text-xs text-gray-400 mt-1">
          <div>
            Start:{" "}
            {comment.start && (
              <button
                className="cursor-pointer bg-transparent border-none text-blue-500"
                onClick={() => handleGoToTime(comment.start)}
              >
                {comment.start}
              </button>
            )}
          </div>
          <div>
            End:{" "}
            {comment.end && (
              <button
                className="cursor-pointer bg-transparent border-none text-blue-500"
                onClick={() => handleGoToTime(comment.end)}
              >
                {comment.end}
              </button>
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={handleLike}
          >
            {isLiked ? (
              <FontAwesomeIcon color="red" icon={faHeart} />
            ) : (
              <FontAwesomeIcon icon={faHeartRegular} />
            )}
          </div>
          <p>{likes}</p>
        </div>
      </div>
    </div>
  );
}
