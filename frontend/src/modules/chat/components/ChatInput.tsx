import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";

interface Props {
  onSend: (message: string, file?: File | null) => void;
}

const ChatInput = ({ onSend }: Props) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!input.trim() && !file) return;

    onSend(input.trim(), file);

    setInput("");
    setFile(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
    e.target.value = "";
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
    <div className="relative flex items-center gap-1 bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-300">
      {/* Emoji Button */}
      <button
        type="button"
        onClick={() => setShowEmoji((prev) => !prev)}
        className="ml-2 p-2 text-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 ease-out transform hover:scale-105 active:scale-95"
      >
        😊
      </button>

      {/* Emoji Picker */}
      {showEmoji && (
        <div
          ref={emojiRef}
          className="absolute bottom-14 left-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="shadow-2xl rounded-2xl overflow-hidden border border-gray-200 bg-white">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        </div>
      )}

      {/* Attachment Button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 ease-out transform hover:scale-105 active:scale-95"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </button>

      {/* File Preview */}
      {file && (
        <div className="absolute bottom-14 left-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-3 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3">
            {file.type.startsWith("image") ? (
              <div className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  className="w-20 h-20 object-cover rounded-xl shadow-md"
                  alt="Preview"
                />
                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 max-w-[200px] truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setFile(null)}
              className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 hover:scale-110 active:scale-95 shadow-md"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Text Input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-1 py-3 px-2 bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none text-base"
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={!input.trim() && !file}
        className={`
          mr-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ease-out
          ${(input.trim() || file)
            ? "bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 cursor-pointer shadow-lg hover:shadow-xl active:scale-95 transform"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        <span className="flex items-center gap-2">
          Send
          <svg
            className="w-4 h-4"
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