"use client";
import React, { useEffect } from "react";
import {
  faChevronDown,
  faChevronUp,
  faEllipsisVertical,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";

import Video, { CommentT } from "@/src/API/video";
import { UserContext } from "@/utils/user-context";
import MentionText from "./mentionText";
import TimeInput from "@/components/timeinput";

interface CommentProps {
  comment: CommentT;
  video: Video;
  goToTime: (time: string) => void;
}
export default function Comment({ comment, video, goToTime }: CommentProps) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [likes, setLikes] = React.useState(comment.likes);
  const { user } = React.useContext(UserContext);

  const [isReplying, setIsReplying] = React.useState(false);
  const [replyText, setReplyText] = React.useState("");
  const [replyComments, setReplyComments] = React.useState<Array<CommentT>>([]);
  const [isReplyCommentShown, setIsReplyCommentShown] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState(comment.content);
  const [startMinutes, setStartMinutes] = React.useState(
    comment.start.split(":")[0]
  );
  const [startSeconds, setStartSeconds] = React.useState(
    comment.start.split(":")[1]
  );
  const [endMinutes, setEndMinutes] = React.useState(comment.end.split(":")[0]);
  const [endSeconds, setEndSeconds] = React.useState(comment.end.split(":")[1]);

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

  const handleEditComment = React.useCallback(() => {
    if (
      startMinutes === "" ||
      startSeconds === "" ||
      endMinutes === "" ||
      endSeconds === "" ||
      value === "" ||
      !user
    ) {
      return;
    }
    // Video.editComment(
    //   {
    //     start: `${Number(startMinutes)}:${Number(startSeconds)}`,
    //     end: `${Number(endMinutes)}:${Number(endSeconds)}`,
    //     content: value,
    //   },
    //   comment.id,
    //   video.data.id,
    //   user
    // ).then((editedComment) => {
    //   setValue(editedComment.content);
    //   setStartMinutes(editedComment.start.split(":")[0]);
    //   setStartSeconds(editedComment.start.split(":")[1]);
    //   setEndMinutes(editedComment.end.split(":")[0]);
    //   setEndSeconds(editedComment.end.split(":")[1]);
    // });
    // setIsEditing(false);
  }, []);

  const handleDeleteComment = React.useCallback(() => {
    if (!user) {
      return;
    }
    // Video.deleteComment(user, comment.id, video.data.id).then(() => {
    //   // setCommentsList((prev) => prev.filter((c) => c.id !== comment.id));
    // });
  }, []);

  const handleCancelEditComment = React.useCallback(() => {
    setValue(comment.content);
    setStartMinutes(comment.start.split(":")[0]);
    setStartSeconds(comment.start.split(":")[1]);
    setEndMinutes(comment.end.split(":")[0]);
    setEndSeconds(comment.end.split(":")[1]);
    setIsEditing(false);
  }, []);

  return (
    <div className="py-3 shadow-none flex flex-row gap-4 items-start w-full">
      <Avatar src={comment.user.profileUrl} />
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{comment.user.name}</p>
          <p className="text-xs text-gray-500">
            {new Date(comment.modifiedAt).toLocaleString()}
          </p>
        </div>
        {isEditing ? (
          <div className="flex-1">
            <Input
              fullWidth
              placeholder="Add a public comment..."
              size="sm"
              value={value}
              variant="underlined"
              onValueChange={setValue}
            />
            <div className="flex gap-2 mt-2 justify-end">
              <div className="flex gap-2 items-center">
                from
                <TimeInput
                  minutes={startMinutes}
                  seconds={startSeconds}
                  setMinutes={setStartMinutes}
                  setSeconds={setStartSeconds}
                />
                to
                <TimeInput
                  minutes={endMinutes}
                  seconds={endSeconds}
                  setMinutes={setEndMinutes}
                  setSeconds={setEndSeconds}
                />
              </div>
              <Button size="sm" onPress={handleCancelEditComment}>
                Cancel
              </Button>
              <Button
                color="primary"
                // disabled={!commentText.trim()}
                size="sm"
                onPress={handleEditComment}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <MentionText text={value} />
            </div>
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
          </div>
        )}
        <div className="mt-2 flex flex-row items-center gap-2">
          <div className="flex items-center justify-center gap-2">
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
          <div className="flex justify-center items-center">
            <Button
              size="sm"
              variant="light"
              radius="lg"
              onPress={() => setIsReplying(true)}
            >
              Reply
            </Button>
          </div>
        </div>
        {isReplying && (
          <div className="mt-2 w-full flex flex-col gap-2">
            <Input
              fullWidth
              placeholder="Add a reply..."
              size="sm"
              value={replyText}
              variant="underlined"
              onValueChange={setReplyText}
            />
            <div className="flex flex-row justify-end gap-2">
              <Button size="sm" onPress={() => setIsReplying(false)}>
                Cancel
              </Button>
              <Button
                color="primary"
                // disabled={!commentText.trim()}
                size="sm"
                // onPress={handleCommentSubmit}
              >
                Reply
              </Button>
            </div>
          </div>
        )}
        <div className="mt-2">
          {replyComments.length === 0 && (
            <Button
              size="sm"
              className="w-fit"
              variant="light"
              radius="lg"
              onPress={() => setIsReplyCommentShown((prev) => !prev)}
              endContent={
                <FontAwesomeIcon
                  icon={isReplyCommentShown ? faChevronUp : faChevronDown}
                />
              }
            >
              1 reply
            </Button>
          )}
          {isReplyCommentShown &&
            replyComments.map((replyComment) => (
              <Comment
                key={replyComment.id}
                comment={replyComment}
                video={video}
                goToTime={goToTime}
              />
            ))}
        </div>
      </div>
      {/* If comment is mine */}
      <div>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" isIconOnly radius="full">
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new" onPress={() => setIsEditing(true)}>
              Edit
            </DropdownItem>
            <DropdownItem key="copy" onPress={handleDeleteComment}>
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
