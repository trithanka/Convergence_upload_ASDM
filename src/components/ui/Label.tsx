import React from 'react';

interface LabelProps {
  text: string;  // The text to display in the label
  required?: boolean;  // If true, show a red asterisk
}

const Label: React.FC<LabelProps> = ({ text, required = false }) => {
  return (
    <label className="block font-semibold mb-2 text-sm text-gray-600">
      {text} {required && <span className="text-red-500">*</span>}
    </label>
  );
};

export default Label;
