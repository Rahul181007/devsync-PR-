import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  addMessage,
  clearChat,
  getProjectMessage,
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
  const socketRef = useRef<ReturnType<typeof connectSocket> | null>(null);
  const { messages, loading, error } = useAppSelector(
    (state) => state.companyChat
  );

  const { user} = useAppSelector((state) => state.auth);

  /* ================= LOAD OLD MESSAGES ================= */
  useEffect(() => {
    if (!projectId) return;

    dispatch(getProjectMessage({ projectId }));

    return () => {
      dispatch(clearChat());
    };
  }, [dispatch, projectId]);

 /* ================= SOCKET CONNECTION ================= */
useEffect(() => {
  if (!user?.id || !projectId) return;

  const socket = connectSocket();
  socketRef.current = socket;

  const receiveHandler = (message: ChatMessage) => {
    console.log("RECEIVED:", message);
    dispatch(addMessage(message));
  };

  socket.on("receive_message", receiveHandler);

  // ✅ JOIN ROOM HERE (important)
  socket.emit("join_project", { projectId });

  return () => {
    socket.off("receive_message", receiveHandler);
  };
}, [dispatch, user?.id, projectId]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
const handleSend = (message: string) => {
  if (!socketRef.current) return;

  socketRef.current.emit("send_message", {
    projectId,
    message,
  });
};

  /* ================= RENDER ================= */
  return (
    <div className="bg-white rounded-lg border border-gray-200 flex flex-col h-[400px]">
      {/* Header - More compact */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-700">Project Chat</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {messages.length}
          </span>
        </div>
        {loading && (
          <div className="flex items-center">
            <Spinner size="sm" />
          </div>
        )}
      </div>

      {/* Error Message - More compact */}
      {error && (
        <div className="mx-4 mt-2 p-2 bg-red-50 border border-red-100 rounded-md">
          <p className="text-red-500 text-xs flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Messages Container - More compact spacing */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400">No messages yet</p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessages
            key={msg.id}
            message={msg.message}
            isOwn={msg.senderId === user?.id}
            createdAt={msg.createdAt}
            senderName={msg.senderName}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input Area - More compact */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default ProjectChat;