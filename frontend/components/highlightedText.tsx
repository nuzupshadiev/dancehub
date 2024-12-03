"use client";
import Project from "@/src/API/project";
import { UserContext } from "@/utils/user-context";
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
import { on } from "events";
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
  const [listOfVideos, setListOfVideos] = React.useState<
    { desription: string; id: string; title: string }[]
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
      setListOfVideos(resp.videos);
      setProjectTitle(resp.title);
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
    (video: { desription: string; id: string; title: string }) => {
      router.push(`/video/${video.id}`);
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
                All videos for {currentMatch} in project {projectTitle}
              </ModalHeader>
              <ModalBody>
                {listOfVideos.map((video) => (
                  <Card
                    key={video.id}
                    disableRipple
                    isPressable
                    as={"div"}
                    className={
                      "flex flex-col gap-y-2 border-2 border-transparent hover:border-primary-600 bg-primary-50 dark:bg-darkBg-900 p-4"
                    }
                    onPress={() => handleGotoProject(video)}
                  >
                    <CardBody className=" flex flex-row gap-4 !p-0 ml-1 h-20">
                      {/* <img
                      alt="thumbnail"
                      className="object-fit rounded-lg"
                      src={thumbnailUrl}
                    /> */}
                      <div>
                        <h1 className="font-bold text-xl text-foreground">
                          {video.title}
                        </h1>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default HighlightText;
