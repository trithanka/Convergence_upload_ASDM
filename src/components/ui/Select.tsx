import React from 'react';

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps {
  options: string[] | Option[]; // This now accepts either a string array or an array of objects with 'label' and 'value'
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; // onChange handler for selection
  placeholder?: string; // Optional placeholder text
  className?: string; // Optional className for custom styling
}

const Select: React.FC<SelectProps> = ({ options, onChange, placeholder = '-- Select --', className }) => {
  return (
    <select
      className={`w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${className || ''}`}
      onChange={onChange}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {Array.isArray(options) && options.map((option, index) => {
        if (typeof option === 'string') {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        } else {
          // If it's an object with 'label' and 'value'
          return (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          );
        }
      })}
    </select>
  );
};

export default Select;
