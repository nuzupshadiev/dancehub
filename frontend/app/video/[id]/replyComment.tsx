"use client";
import React from "react";
import CommentInput from "@/components/commentInput";
import HighlightText from "@/components/highlightedText";
import Video, { CommentT } from "@/src/API/video";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useState } from "react";
import { UserContext } from "@/utils/user-context";

type ReplyCommentProps = {
  comment: CommentT;
  deleteComment: (id: string) => void;
  commentId: string;
  videoId: string;
  deleteReply: (id: string) => void;
};
export default function ReplyComment({
  comment,
  deleteComment,
  commentId,
  videoId,
  deleteReply,
}: ReplyCommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(comment.content);
  const { user } = React.useContext(UserContext);
  const handleCancelEditComment = React.useCallback(() => {
    setIsEditing(false);
    setValue(comment.content);
  }, []);

  const handleEditComment = React.useCallback(() => {
    if (value === "" || !user) {
      return;
    }
    Video.updateReply(user, commentId, videoId, comment.id, value).then(
      (reply) => {
        setIsEditing(false);
        setValue(reply.content);
      }
    );
  }, [value, user, commentId, videoId, comment.id]);

  const handleDeleteReply = React.useCallback(() => {
    deleteReply(comment.id);
  }, [comment.id, deleteReply]);

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
            <CommentInput
              value={value}
              onChangeValue={setValue}
              fullWidth
              placeholder="Add a public comment..."
              size="sm"
              variant="underlined"
            />
            <div className="flex gap-2 mt-2 justify-end">
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
          <HighlightText text={value} />
        )}
      </div>
      <div>
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly radius="full" variant="light">
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new" onPress={() => setIsEditing(true)}>
              Edit
            </DropdownItem>
            <DropdownItem key="copy" onPress={handleDeleteReply}>
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
