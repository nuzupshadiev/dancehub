import React from "react";

interface MentionTextProps {
  text: string;
}

const MentionText: React.FC<MentionTextProps> = ({ text }) => {
  const mentionRegex = /@\w+/g;

  const parts = text
    .split(mentionRegex)
    .reduce<string[]>((acc, part, index, arr) => {
      if (index < arr.length - 1) {
        const match = text.match(mentionRegex)?.[index];
        acc.push(part);
        if (match) acc.push(match);
      } else {
        acc.push(part);
      }
      return acc;
    }, []);

  return (
    <p>
      {parts.map((part, index) =>
        mentionRegex.test(part) ? (
          <button key={index} className="text-blue-600">
            {part}
          </button>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </p>
  );
};

export default MentionText;
