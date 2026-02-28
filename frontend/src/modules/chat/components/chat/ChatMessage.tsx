interface Props {
  message: string;
  isOwn: boolean;
  createdAt?: string;
  senderName?: string;
}

const ChatMessage = ({
  message,
  isOwn,
  createdAt,
  senderName,
}: Props) => {
  const formattedTime = createdAt
    ? new Date(createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`flex items-end gap-2 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar (only for others) */}
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-700">
          {senderName?.charAt(0).toUpperCase()}
        </div>
      )}

      <div
        className={`relative max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
          isOwn
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-white text-gray-800 border rounded-bl-sm"
        }`}
      >
        {/* Sender name */}
        {!isOwn && senderName && (
          <p className="text-xs font-semibold text-gray-500 mb-1">
            {senderName}
          </p>
        )}

        {/* Message */}
        <p className="text-sm break-words whitespace-pre-wrap">
          {message}
        </p>

        {/* Time */}
        {createdAt && (
          <div
            className={`text-[10px] mt-1 text-right ${
              isOwn ? "text-blue-200" : "text-gray-400"
            }`}
          >
            {formattedTime}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;