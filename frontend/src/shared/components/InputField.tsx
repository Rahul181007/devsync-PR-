import React from "react";

interface InputFieldProps {
 
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({

  value,
  onChange,
  error,
  placeholder,
  type = "text",
}) => {
  return (
    <div>


      {/* Input */}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg px-4 py-2.5 text-sm transition-all border ${
          error
            ? "border-red-500 focus:ring-red-500/20"
            : "border-gray-300 focus:ring-blue-500/20"
        } focus:outline-none`}
        placeholder={placeholder}
      />

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default InputField;