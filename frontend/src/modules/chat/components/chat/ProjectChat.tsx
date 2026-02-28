import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  addMessage,
  clearChat,
  getProjectMessage,
} from "../../store/chat.slice";
import { connectSocket } from "../../../../shared/socket";
import ChatMessages from "./ChatMessage";
import ChatInput from "./ChatInput";
import Spinner from "../../../../shared/components/LoadingSpinner";
import type { ChatMessage } from "../../types/chat.types";

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
  if (!user?.id || !projectId ) return;

  const socket = connectSocket();
  socketRef.current = socket;

  socket.emit("join_project", { projectId });

  const receiveHandler = (message: ChatMessage) => {
    dispatch(addMessage(message));
  };

  socket.on("receive_message", receiveHandler);

  return () => {
    socket.off("receive_message", receiveHandler);
  };
}, [dispatch, projectId, user?.id]);

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
    <div className="bg-white rounded-xl shadow p-4 flex flex-col h-[500px]">
      {loading && (
        <div className="flex justify-center">
          <Spinner size="sm" />
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No messages yet 🚀
          </p>
        )}

        {messages.map((msg) => (
          <ChatMessages
            key={msg.id}
            message={msg.message}
            isOwn={msg.senderId === user?.id}
            createdAt={msg.createdAt}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ProjectChat;