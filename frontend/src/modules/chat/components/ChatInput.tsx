import React, { useState, useRef, useEffect } from "react"

interface Props {
  onSend: (message: string) => void;
}

const ChatInput = ({ onSend }: Props) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="I type your message..."
        className="flex-1 px-4 py-2.5 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
      />

      <button
        onClick={handleSend}
        disabled={!input.trim()}
        className={`
          mr-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200
          ${input.trim() 
            ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-sm" 
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
