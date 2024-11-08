"use client";
import React from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "@nextui-org/react";

import { CommentT } from "@/src/API/video";

interface CommentProps {
  comment: CommentT;
}
export default function Comment({ comment }: CommentProps) {
  const [isLiked, setIsLiked] = React.useState(false);

  const handleLike = React.useCallback(() => {
    setIsLiked((prev) => !prev);
  }, []);

  return (
    <div className="py-3 shadow-none flex flex-row gap-4 items-start">
      <Avatar src={comment.user.profilePicture} />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{comment.user.username}</p>
          <p className="text-xs text-gray-500">{comment.modifiedAt}</p>
        </div>
        <p className="text-sm">{comment.content}</p>
        <div className="mt-2 flex items-center gap-2">
          <div
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={handleLike}
          >
            {isLiked ? (
              <FontAwesomeIcon icon={faHeart} color="red" />
            ) : (
              <FontAwesomeIcon icon={faHeartRegular} />
            )}
          </div>
          <p>{isLiked ? comment.likes + 1 : comment.likes}</p>
        </div>
      </div>
    </div>
  );
}
