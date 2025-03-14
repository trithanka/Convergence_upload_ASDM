import React from "react";

type DropdownOption = {
  label: string; // Display name
  value: string ; // Actual value
};

type DropdownProps = {
  options: DropdownOption[]; // Array of objects with label and value
  onSelect: (option: DropdownOption) => void; // Callback for selection
  selected?: string | number; // Currently selected value
  className?: string; // Custom class for styling
  placeholder?: string; // Custom placeholder
};

const SearchDropdown: React.FC<DropdownProps> = ({
  options,
  onSelect,
  selected = "",
  className = "",
  placeholder = "Select an option",
}) => {
  return (
    <select
      value={selected} // Controlled component
      onChange={(e) => {
        const selectedOption = options.find(
          (option) => option.value === e.target.value
        );
        if (selectedOption) {
          onSelect(selectedOption); // Pass the full object
        }
      }}
      className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      aria-label="Search dropdown"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SearchDropdown;
