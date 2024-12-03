import React, { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";

export type UserT = {
  id: string;
  name: string;
  profileUrl: string;
};

type CommentInputProps = {
  value: string;
  onChangeValue: (value: string) => void;
  setHashtagsParent: (hashtags: string[]) => void;
  mentionSuggestions?: UserT[];
} & React.ComponentProps<typeof Input>;

const CommentInput: React.FC<CommentInputProps> = ({
  mentionSuggestions = [],
  value,
  onChangeValue,
  setHashtagsParent,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState<UserT[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);

  useEffect(() => {
    setInputValue(value);
    extractHashtags(value);
  }, [value]);

  // Extract hashtags from the input value
  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#(\w+)/g;
    const hashtags: string[] = [];
    let match;

    while ((match = hashtagRegex.exec(text)) !== null) {
      hashtags.push(`#${match[1]}`);
    }

    return hashtags;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputValue(value);
    const extractedHashtags = extractHashtags(value);

    onChangeValue(value);
    setHashtagsParent(extractedHashtags);

    // Detect `@` trigger
    const lastWord = value.split(" ").pop() || "";

    if (lastWord.startsWith("@")) {
      const query = lastWord.slice(1).toLowerCase();

      setFilteredSuggestions(
        mentionSuggestions.filter((mention) =>
          mention.name.toLowerCase().includes(query)
        )
      );
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: UserT) => {
    const words = inputValue.split(" ");

    words.pop(); // Remove the last word (trigger)
    const newValue = [...words, suggestion.name].join(" ") + " ";

    setInputValue(newValue);
    setDropdownVisible(false);
  };

  return (
    <div className="relative w-full mx-auto">
      <Input
        placeholder="Add a public comment..."
        size="sm"
        variant="underlined"
        value={inputValue}
        onChange={handleInputChange}
        {...props}
      />
      {dropdownVisible && (
        <select
          className="absolute left-0 top-full mt-2 w-full bg-white shadow-lg border border-gray-200 rounded-md z-10"
          size={filteredSuggestions.length}
          onChange={(e) => {
            const selectedSuggestion = filteredSuggestions.find(
              (suggestion) => suggestion.name === e.target.value
            );

            if (selectedSuggestion) {
              handleSelectSuggestion(selectedSuggestion);
            }
          }}
        >
          {filteredSuggestions.map((suggestion) => (
            <option key={suggestion.id} value={suggestion.name}>
              {suggestion.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CommentInput;
