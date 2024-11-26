import React, { useEffect, useState } from "react";
import { Input, Dropdown, DropdownMenu } from "@nextui-org/react";

export interface Suggestion {
  id: string;
  label: string;
}

type CommentInputProps = {
  value: string;
  onChangeValue: (value: string) => void;
  mentionSuggestions?: Suggestion[];
  tagSuggestions?: Suggestion[];
} & React.ComponentProps<typeof Input>;

const CommentInput: React.FC<CommentInputProps> = ({
  mentionSuggestions = [],
  tagSuggestions = [],
  value,
  onChangeValue,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>(
    []
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputValue(value);
    onChangeValue(value);

    // Detect `@` or `#` trigger
    const lastWord = value.split(" ").pop() || "";

    if (lastWord.startsWith("@")) {
      const query = lastWord.slice(1).toLowerCase();

      setFilteredSuggestions(
        mentionSuggestions.filter((mention) =>
          mention.label.toLowerCase().includes(query)
        )
      );
      setDropdownVisible(true);
    } else if (lastWord.startsWith("#")) {
      const query = lastWord.slice(1).toLowerCase();

      setFilteredSuggestions(
        tagSuggestions.filter((tag) => tag.label.toLowerCase().includes(query))
      );
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const words = inputValue.split(" ");

    words.pop(); // Remove the last word (trigger)
    const newValue = [...words, suggestion.label].join(" ") + " ";

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
              (suggestion) => suggestion.label === e.target.value
            );

            if (selectedSuggestion) {
              handleSelectSuggestion(selectedSuggestion);
            }
          }}
        >
          {filteredSuggestions.map((suggestion) => (
            <option key={suggestion.id} value={suggestion.label}>
              {suggestion.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CommentInput;
