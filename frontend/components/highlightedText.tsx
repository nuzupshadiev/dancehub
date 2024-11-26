"use client";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";

interface HighlightTextProps {
  text: string;
}

const HighlightText: React.FC<HighlightTextProps> = ({ text }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentMatch, setCurrentMatch] = React.useState("");

  const handleOnPress = React.useCallback((text: string) => {
    if (text.startsWith("@")) {
      return;
    } else {
      setCurrentMatch(text);
      onOpen();
    }
  }, []);
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

  return (
    <div>
      {processText(text)}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                All videos for {currentMatch}
              </ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem
                  eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
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
