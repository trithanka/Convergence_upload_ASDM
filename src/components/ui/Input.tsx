// import React from "react";

// interface InputProps {
//   type: string;
//   placeholder?: string;
//   value?: string | number; // Allow both string and number types for flexibility
//   onChange?: React.ChangeEventHandler<HTMLInputElement>;
//   className?: string;
//   onBlur?: React.FocusEventHandler<HTMLInputElement>;
//   disabled?: boolean;
//   name?: string;
// }

// const Input: React.FC<InputProps> = ({
//   type,
//   placeholder,
//   value,
//   onChange,
//   className,
//   onBlur,
//   disabled,
//   name,
// }) => {
//   // Handle the change event for 'number' type
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (type === "number") {
//       // Convert the value to a number
//       onChange?.(e);
//     } else {
//       onChange?.(e);
//     }
//   };

//   return (
//     <div>
//       <input
//         type={type}
//         name={name}
//         className={`w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${className}`}
//         placeholder={placeholder}
//         value={value}
//         onChange={handleChange}
//         onBlur={onBlur}
//         disabled={disabled}
//       />
//     </div>
//   );
// };

// export default Input;
import React, { forwardRef } from "react";

interface InputProps {
  type: string;
  placeholder?: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  disabled?: boolean;
  name?: string;
  max?: string; 
  min?: string;
  maxLength?: number
}


const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, placeholder, value, onChange, className, onBlur, disabled, name, max,min, maxLength }, ref) => {
    return (
      <div>
        <input
          ref={ref} 
          type={type}
          name={name}
          className={`w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          max={max} 
          min={min}
          maxLength={maxLength} 
        />
      </div>
    );
  }
);

Input.displayName = "Input"; // Needed for React dev tools

export default Input;

