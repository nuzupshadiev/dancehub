import React, { useEffect } from "react";
import { useState } from "react";
import { Input, Button, Avatar } from "@nextui-org/react";

import Comment from "./comment";

import TimeInput from "@/components/timeinput";
import Video, { CommentT } from "@/src/API/video";
import { UserContext } from "@/utils/user-context";
import { Selection } from "@nextui-org/react";
import CommentInput from "@/components/commentInput";
import { UserT } from "@/src/API/user";
interface CommentsSectionProps {
  video: Video;
  goToTime: (time: string) => void;
  secondsElapsed: number;
  projectId: string;
  selectedUsers: Selection;
  usersInTheProject: UserT[];
}
export default function CommentsSection({
  video,
  goToTime,
  secondsElapsed,
  projectId,
  selectedUsers,
  usersInTheProject,
}: CommentsSectionProps) {
  const [commentsList, setCommentsList] = useState<Array<CommentT>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [startMinutes, setStartMinutes] = useState("");
  const [startSeconds, setStartSeconds] = useState("");
  const [endMinutes, setEndMinutes] = useState("");
  const [endSeconds, setEndSeconds] = useState("");
  const { user } = React.useContext(UserContext);
  const handleCancel = React.useCallback(() => {
    setCommentText("");
    setIsTyping(false);
  }, []);

  useEffect(() => {
    Video.getComments(video.data.id, user).then((comments) => {
      setCommentsList(comments);
    });
  }, [video.data.id, user]);

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
    Video.leaveComment(
      {
        start: `${Number(startMinutes)}:${Number(startSeconds)}`,
        end: `${Number(endMinutes)}:${Number(endSeconds)}`,
        content: commentText,
      },
      video.data.id,
      user
    ).then((comment) => {
      setCommentsList((prev) => [...prev, comment.comment]);
    });
    setCommentText("");
    setIsTyping(false);
  }, [user, commentText, startMinutes, startSeconds, endMinutes, endSeconds]);

  const filteredTexts = commentsList.filter((text) => {
    if (selectedUsers === "all") return true;
    else if (selectedUsers.size === 0) return true;

    return text.content.includes(`@${selectedUsers.values().next().value}`);
  });

  const inTimeTexts = filteredTexts.filter((text) => {
    const [startMin, startSec] = text.start.split(":").map(Number);
    const [endMin, endSec] = text.end.split(":").map(Number);
    const seconds = Math.floor(secondsElapsed);

    return (
      seconds >= startMin * 60 + startSec && seconds <= endMin * 60 + endSec
    );
  });

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
    <div className="">
      <div className="py-4 flex flex-row gap-4 items-start">
        <Avatar src={user.data.profilePicture} />{" "}
        <div className="flex-1">
          <CommentInput
            fullWidth
            value={commentText}
            onChangeValue={setCommentText}
            onFocus={() => setIsTyping(true)}
            mentionSuggestions={usersInTheProject}
          />
          {/* <Input
            fullWidth
            placeholder="Add a public comment..."
            size="sm"
            value={commentText}
            variant="underlined"
            onFocus={() => setIsTyping(true)}
            onValueChange={setCommentText}
          /> */}
          {isTyping && (
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
              <Button size="sm" onPress={handleCancel}>
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={!commentText.trim()}
                size="sm"
                onPress={handleCommentSubmit}
              >
                Comment
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="">
        {inTimeTexts.length === 0 ? (
          <p className="py-4">
            No comments yet or No comments for this part of the video yet. Be
            the first to comment!
          </p>
        ) : (
          inTimeTexts.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              deleteComment={handleDeleteComment}
              goToTime={goToTime}
              video={video}
            />
          ))
        )}
      </div>
    </div>
  );
}
