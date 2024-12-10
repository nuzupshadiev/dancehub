"use client";
import Project from "@/src/API/project";
import { UserContext, VideoVersionContext } from "@/utils/user-context";
import { Button } from "@nextui-org/button";
import {
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

interface HighlightTextProps {
  text: string;
  projectId: string;
}

const HighlightText: React.FC<HighlightTextProps> = ({ text, projectId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentMatch, setCurrentMatch] = React.useState("");
  const { user } = React.useContext(UserContext);
  const { setVideoVersion } = React.useContext(VideoVersionContext);
  const [listOfVideos, setListOfVideos] = React.useState<
    { desription: string; id: string; title: string }[]
  >([]);
  const [listOfComments, setListOfComments] = React.useState<
    {
      project: string;
      title: string;
      version: string;
      content: string;
      id: string;
    }[]
  >([]);
  const [projectTitle, setProjectTitle] = React.useState("");
  const router = useRouter();

  const handleOnPress = React.useCallback((text: string) => {
    if (text.startsWith("@")) {
      return;
    } else {
      setCurrentMatch(text);
      onOpen();
    }
  }, []);

  React.useEffect(() => {
    if (!user) return;
    Project.getTagRelatedVideos(user, projectId, currentMatch).then((resp) => {
      const comments = [resp.comments, resp.replies].flat();

      setListOfComments(comments);
      // setProjectTitle(resp.title);
    });
  }, [currentMatch, user, projectId]);
  // Regular expressions to match mentions and tags
  const mentionRegex = /@\w+/g;
  const tagRegex = /#\w+/g;

  // Function to process the text and apply highlights
  const processText = (text: string) => {
    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    // Combine mentions and tags for unified matching
    const combinedRegex = new RegExp(
      `${mentionRegex.source}|${tagRegex.source}`,
      "g"
    );
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      const [matchedText] = match;
      const matchStart = match.index;

      // Add non-highlighted text
      if (matchStart > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {text.slice(lastIndex, matchStart)}
          </span>
        );
      }

      // Add highlighted text
      parts.push(
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <span
          key={`highlight-${matchStart}`}
          className={
            matchedText.startsWith("@")
              ? "text-blue-500 font-bold cursor-pointer"
              : "text-green-500 font-bold cursor-pointer"
          }
          role="button"
          tabIndex={0}
          onClick={() => handleOnPress(matchedText)}
        >
          {matchedText}
        </span>
      );

      lastIndex = matchStart + matchedText.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>
      );
    }

    return parts;
  };

  const handleGotoProject = React.useCallback(
    (comment: {
      project: string;
      title: string;
      version: string;
      content: string;
      id: string;
    }) => {
      setVideoVersion(comment.version);
      router.push(`/video/${comment.id}`);
      onOpenChange();
    },
    [router, onOpenChange]
  );

  return (
    <div>
      {processText(text)}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                All comments for {currentMatch}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col pb-4 gap-2">
                  {listOfComments.length > 0 ? (
                    listOfComments.map((comment, index) => {
                      const date = new Date(comment.version);

                      return (
                        <div
                          key={index}
                          className="cursor-pointer bg-default-200 p-2 rounded-lg"
                          onClick={() => handleGotoProject(comment)}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="flex flex-row gap-2 items-center">
                            <p className="text-sm font-semibold">
                              {comment.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {date.toLocaleString()}
                            </p>
                          </div>
                          {/* <h1 className="font-semibold">{`${comment.title} | ${date.toLocaleString()}`}</h1> */}
                          <p>
                            {comment.content.length > 150
                              ? `${comment.content.slice(0, 50)}...`
                              : comment.content}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="pb-4">No comments with this hashtag yet</p>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default HighlightText;
