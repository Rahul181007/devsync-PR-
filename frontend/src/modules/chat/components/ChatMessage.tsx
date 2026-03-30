interface Props {
  message: string;
  isOwn: boolean;
  createdAt?: string;
  senderName?: string;

  attachmentUrl?: string | null;
  attachmentType?: "image" | "file" | null;
  fileName?: string | null;
}

const ChatMessage = ({ message, isOwn, createdAt, senderName ,attachmentUrl,attachmentType,fileName}: Props) => {
  const formattedTime = createdAt
    ? new Date(createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`flex items-end gap-2 group ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar (only for others) - Enhanced with gradient and animation */}
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md ring-2 ring-white transform transition-transform group-hover:scale-110">
          {senderName?.charAt(0).toUpperCase()}
        </div>
      )}

      <div
        className={`relative max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-md transition-all duration-200 ${
          isOwn
            ? "bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-br-sm hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
            : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm hover:border-gray-200 hover:shadow-md"
        }`}
      >
        {/* Decorative tail for messages */}
        <div
          className={`absolute bottom-0 w-3 h-3 transform rotate-45 ${
            isOwn
              ? "-right-1 bg-linear-to-r from-blue-600 to-blue-600"
              : "-left-1 bg-white border-l border-t border-gray-100"
          }`}
        />

        {/* Sender name with improved styling */}
        {!isOwn && senderName && (
          <p className="text-xs font-semibold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 mb-1">
            {senderName}
          </p>
        )}

        {/* Message with better typography */}
{message && (
  <p className="text-sm wrap-break-word whitespace-pre-wrap leading-relaxed">
    {message}
  </p>
)}


{attachmentUrl && (
  <div className="mt-2">
    {attachmentType === "image" ? (
      <img
        src={attachmentUrl}
        alt="attachment"
        className="rounded-lg max-w-[220px] object-cover border border-gray-200"
      />
    ) : (
      <a
        href={attachmentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
          isOwn
            ? "bg-blue-600 border-blue-500 text-white"
            : "bg-gray-50 border-gray-200 text-gray-700"
        }`}
      >
        📄 {fileName || "File"}
      </a>
    )}
  </div>
)}

        {/* Time with improved positioning and styling */}
        {createdAt && (
          <div
            className={`flex items-center justify-end gap-1 text-[10px] mt-1.5 ${
              isOwn ? "text-blue-200" : "text-gray-400"
            }`}
          >
            <svg
              className={`w-3 h-3 ${isOwn ? "text-blue-200" : "text-gray-400"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            {formattedTime}

            {isOwn && <span className="ml-1">✓</span>}
          </div>
        )}
      </div>

      {/* Spacer for own messages to balance layout */}
      {isOwn && <div className="w-8" />}
    </div>
  );
};

export default ChatMessage;
