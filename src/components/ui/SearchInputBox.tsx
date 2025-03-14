import React from "react";

type SearchInputBoxProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string; // Accepts input type dynamically
};

const SearchInputBox: React.FC<SearchInputBoxProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  type = "text", // Default type is text
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      autoFocus
    />
  );
};

export default SearchInputBox;
