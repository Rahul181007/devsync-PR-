import React, { useState } from "react"

interface Props {
  onSend: (message: string) => void;
}

const ChatInput = ({ onSend }: Props) => {
  const [input, setInput] = useState("");

    const handleSend=()=>{
        if(!input.trim()) return;
        onSend(input.trim())
        setInput("")
    }

      const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

    return (
    <div className="flex items-center gap-2 mt-4 border-t pt-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
