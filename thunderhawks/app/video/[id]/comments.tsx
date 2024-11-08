import React from "react";
import { useState } from "react";
import { Input, Button, Avatar } from "@nextui-org/react";

import Comment from "./comment";

import TimeInput from "@/components/timeinput";
import { CommentT } from "@/src/API/video";

interface CommentsSectionProps {
  comments: Array<CommentT>;
}
export default function CommentsSection({ comments }: CommentsSectionProps) {
  const [commentsList, setCommentsList] = useState<Array<CommentT>>(comments);
  const [isTyping, setIsTyping] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [startMinutes, setStartMinutes] = useState("");
  const [startSeconds, setStartSeconds] = useState("");
  const [endMinutes, setEndMinutes] = useState("");
  const [endSeconds, setEndSeconds] = useState("");
  const handleCancel = React.useCallback(() => {
    setCommentText("");
    setIsTyping(false);
  }, []);
  const handleCommentSubmit = React.useCallback(() => {
    setCommentsList((prev) => [
      ...prev,
      {
        content: commentText,
        end: `${endMinutes}:${endSeconds}`,
        id: Math.random().toString(),
        likedBy: [],
        likes: 0,
        modifiedAt: new Date().toISOString(),
        start: `${startMinutes}:${startSeconds}`,
        user: {
          id: "1",
          profilePicture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
          username: "John Doe",
          name: "John Doe",
        },
        version: "1",
        videoId: "1",
      },
    ]);
    setCommentText("");
    setIsTyping(false);
  }, []);

  return (
    <div className="">
      <div className="py-4 flex flex-row gap-4 items-start">
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />{" "}
        <div className="flex-1">
          <Input
            fullWidth
            placeholder="Add a public comment..."
            size="sm"
            value={commentText}
            variant="underlined"
            onFocus={() => setIsTyping(true)}
            onValueChange={setCommentText}
          />
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
        {commentsList.length === 0 ? (
          <p className="py-4">No comments yet. Be the first to comment!</p>
        ) : (
          commentsList.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
