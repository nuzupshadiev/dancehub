import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Input, Button, Avatar } from "@nextui-org/react";
import { Selection } from "@nextui-org/react";

import Comment from "./comment";

import TimeInput from "@/components/timeinput";
import Video, { CommentT } from "@/src/API/video";
import { UserContext } from "@/utils/user-context";
import CommentInput from "@/components/commentInput";
import { UserT } from "@/src/API/user";
interface CommentsSectionProps {
  video: Video;
  goToTime: (time: string) => void;
  secondsElapsed: number;
  projectId: string;
  selectedUsers: Selection;
  usersInTheProject: UserT[];
  relevantOnly?: boolean;
}
export default function CommentsSection({
  video,
  goToTime,
  secondsElapsed,
  projectId,
  selectedUsers,
  usersInTheProject,
  relevantOnly,
}: CommentsSectionProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [startMinutes, setStartMinutes] = useState("");
  const [startSeconds, setStartSeconds] = useState("");
  const [endMinutes, setEndMinutes] = useState("");
  const [endSeconds, setEndSeconds] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commentsList, setCommentsList] = useState<CommentT[]>([]);
  const { user } = React.useContext(UserContext);
  const handleCancel = React.useCallback(() => {
    setCommentText("");
    setStartMinutes("");
    setStartSeconds("");
    setEndMinutes("");
    setEndSeconds("");
    setIsTyping(false);
  }, []);

  React.useEffect(() => {
    if (!user || !video?.data.id || !video?.data.version) return;
    Video.getComments(video.data.id, user, video.data.version)
      .then((comments) => setCommentsList(comments))
      .catch(() => setCommentsList([]));
  }, [user, video?.data.id, video?.data.version, video]);

  const handleCommentSubmit = React.useCallback(() => {
    if (
      startMinutes === "" ||
      startSeconds === "" ||
      endMinutes === "" ||
      endSeconds === "" ||
      commentText === "" ||
      !user
    ) {
      return;
    }
    setIsLoading(true);
    Video.leaveComment(
      {
        start: `${Number(startMinutes)}:${Number(startSeconds)}`,
        end: `${Number(endMinutes)}:${Number(endSeconds)}`,
        content: commentText,
        tags: hashtags,
      },
      video.data.id,
      user,
      video.data.version
    )
      .then((comment) => {
        setIsLoading(false);
        setCommentText("");
        setStartMinutes("");
        setStartSeconds("");
        setEndMinutes("");
        setEndSeconds("");
        setIsTyping(false);
        setCommentsList((prev) => [...prev, comment.comment]);
      })
      .catch((err) => {
        setIsLoading(false);
        setCommentText("");
        setStartMinutes("");
        setStartSeconds("");
        setEndMinutes("");
        setEndSeconds("");
        setIsTyping(false);
        console.log(err);
      });
  }, [
    user,
    commentText,
    startMinutes,
    startSeconds,
    endMinutes,
    endSeconds,
    hashtags,
  ]);

  const finalComments = React.useMemo(() => {
    // Start with the full list
    let result = commentsList;

    // Filter by relevant time if necessary
    if (relevantOnly) {
      result = result.filter((text) => {
        const [startMin, startSec] = text.start.split(":").map(Number);
        const [endMin, endSec] = text.end.split(":").map(Number);
        const seconds = Math.floor(secondsElapsed);

        return (
          seconds >= startMin * 60 + startSec - 3 &&
          seconds <= endMin * 60 + endSec + 3
        );
      });
    }

    // Filter by selected users if necessary
    if (!(selectedUsers === "all" || selectedUsers.size === 0)) {
      const selectedUserArray = Array.from(selectedUsers.values());
      result = result.filter((text) =>
        selectedUserArray.some((user) => text.content.includes(`@${user}`))
      );
    }

    // Sort by start time
    result = [...result].sort((a, b) => {
      const [startMinA, startSecA] = a.start.split(":").map(Number);
      const [startMinB, startSecB] = b.start.split(":").map(Number);

      return startMinA * 60 + startSecA - (startMinB * 60 + startSecB);
    });

    return result;
  }, [commentsList, selectedUsers, relevantOnly, secondsElapsed]);

  const handleDeleteComment = React.useCallback((commendId: string) => {
    Video.deleteComment(user, commendId, video.data.id)
      .then(() => {
        setCommentsList((prev) =>
          prev.filter((comment) => comment.id !== commendId)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!user) return null;

  return (
    <div className="flex flex-col comments-section  bg-default-100 rounded-lg p-4 justify-between h-full">
      <div className="">
        {finalComments.length === 0 ? (
          <p className="py-4">
            No comments yet or No comments for this part of the video yet. Be
            the first to comment!
          </p>
        ) : (
          <div className="overflow-y-scroll w-full max-h-[540px]">
            {finalComments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                deleteComment={handleDeleteComment}
                goToTime={goToTime}
                video={video}
              />
            ))}
          </div>
        )}
      </div>
      <div className="py-4 flex flex-row gap-4 items-start">
        <Avatar
          showFallback
          name={user.data.name}
          src={user.data.profilePicture}
        />{" "}
        <div className="flex-1">
          <CommentInput
            fullWidth
            mentionSuggestions={usersInTheProject}
            setHashtagsParent={setHashtags}
            value={commentText}
            onChangeValue={setCommentText}
            onFocus={() => setIsTyping(true)}
          />
          {isTyping && (
            <div className="flex gap-2 mt-2 justify-end">
              <div className="flex gap-2 items-center">
                <TimeInput
                  minutes={startMinutes}
                  seconds={startSeconds}
                  setMinutes={setStartMinutes}
                  setSeconds={setStartSeconds}
                />
                ~
                <TimeInput
                  minutes={endMinutes}
                  seconds={endSeconds}
                  setMinutes={setEndMinutes}
                  setSeconds={setEndSeconds}
                />
              </div>
              <Button size="sm" onPress={handleCancel}>
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={!commentText.trim()}
                isLoading={isLoading}
                size="sm"
                onPress={handleCommentSubmit}
              >
                Comment
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
