import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  addMessage,
  clearChat,
  getProjectMessage,
  sendMessage,
} from "../store/chat.slice";
import { connectSocket } from "../../../shared/socket";
import ChatMessages from "./ChatMessage";
import ChatInput from "./ChatInput";
import Spinner from "../../../shared/components/LoadingSpinner";
import type { ChatMessage } from "../types/chat.types";

interface Props {
  projectId: string;
}

const ProjectChat = ({ projectId }: Props) => {
  const dispatch = useAppDispatch();
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<ReturnType<typeof connectSocket> | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const { messages, loading, error } = useAppSelector(
    (state) => state.companyChat
  );

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!projectId) return;

    dispatch(getProjectMessage({ projectId }));

    return () => {
      dispatch(clearChat());
    };
  }, [dispatch, projectId]);

  useEffect(() => {
    if (!user?.id || !projectId) return;

    const socket = connectSocket();
    socketRef.current = socket;

    const receiveHandler = (message: ChatMessage) => {
      console.log("RECEIVED:", message);
      dispatch(addMessage(message));
    };

    socket.on("receive_message", receiveHandler);
    socket.emit("join_project", { projectId });

    return () => {
      socket.off("receive_message", receiveHandler);
    };
  }, [dispatch, user?.id, projectId]);

  // Auto-scroll with user scroll detection
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsUserScrolling(!isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isUserScrolling) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isUserScrolling]);

const handleSend = (message: string, file?: File | null) => {
  if (!file) {
    // ✅ TEXT → socket
    socketRef.current?.emit("send_message", {
      projectId,
      message,
    });
  } else {
    // ✅ FILE → REST (thunk)
    const formData = new FormData();
    formData.append("message", message);
    formData.append("file", file);

    dispatch(sendMessage({ projectId, formData }));
  }
};

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 flex flex-col h-[560px] shadow-lg shadow-gray-100/50 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header - Enhanced */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-linear-to-r from-white to-gray-50/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white"></span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">Project Chat</h3>
            <p className="text-xs text-gray-400 mt-0.5">Collaborate with your team</p>
          </div>
          <span className="ml-1 text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium border border-blue-100">
            {messages.length} messages
          </span>
        </div>
        {loading && (
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
            <Spinner size="sm" />
            <span className="text-xs text-gray-500">Syncing...</span>
          </div>
        )}
      </div>

      {/* Error Message - Enhanced */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50/80 border border-red-200 rounded-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <svg
                className="w-3.5 h-3.5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-600 text-xs font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Messages Container - Enhanced with gradient overlay */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-linear-to-b from-gray-50/30 to-white"
      >
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in duration-500">
            <div className="relative">
              <div className="w-20 h-20 bg-linear-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                <svg
                  className="w-10 h-10 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-500 font-medium mt-2">No messages yet</p>
            <p className="text-xs text-gray-400 mt-1">Be the first to say hello! 👋</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <ChatMessages
              key={msg.id}
              message={msg.message}
                attachmentUrl={msg.attachmentUrl}
  attachmentType={msg.attachmentType}
              isOwn={msg.senderId === user?.id}
              createdAt={msg.createdAt}
              senderName={msg.senderName}
            />
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input Area - Enhanced */}
      <div className="px-6 py-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default ProjectChat;