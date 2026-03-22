import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";

interface Props {
  onSend: (message: string) => void;
}

const ChatInput = ({ onSend }: Props) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-2 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] hover:border-[#D1D5DB] focus-within:border-[#3B82F6] focus-within:ring-2 focus-within:ring-[#3B82F6]/20 transition-all duration-200">
      <button
        type="button"
        onClick={() => setShowEmoji((prev) => !prev)}
        className="ml-3 p-1.5 text-xl text-[#6B7280] hover:text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-all duration-200"
      >
        😊
      </button>

      {showEmoji && (
        <div
          ref={emojiRef}
          className="absolute bottom-12 left-2 z-50 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="shadow-xl rounded-xl overflow-hidden border border-[#E5E7EB]">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-1 py-2.5 bg-transparent text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none"
      />

      <button
        onClick={handleSend}
        disabled={!input.trim()}
        className={`
          mr-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
          ${
            input.trim()
              ? "bg-[#3B82F6] text-white hover:bg-[#2563EB] cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98]"
              : "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
          }
        `}
      >
        <span className="flex items-center gap-1.5">
          Send
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default ChatInput;