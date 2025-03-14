import React from "react";

interface SubmitButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  text: string; // Text to display when not loading
  loadingText?: string; // Text to display when loading
  loading?: boolean; // Loading state
  className?: string; // Additional classes for styling
  disabled?: boolean; // Disabled state
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onClick,
  text,
  loadingText = "Submitting...", // Default loading text
  loading = false,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className={`py-3 px-8 text-xs rounded-md flex items-center gap-2 text-white ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-theme-primary hover:bg-theme-primary-hover"
      } ${className}`}
      disabled={loading || disabled}
    >
      {loading ? loadingText : text}
    </button>
  );
};

export default SubmitButton;
