import { Server, Socket } from "socket.io";
import { ISendMessageUseCase } from "../../application/interface/chat/ISendMessageUseCase";
import { IJoinProjectChatUseCase } from "../../application/interface/chat/IJoinProjectChatUseCase";

interface SendMessagePayload {
  projectId: string;
  message: string;
  replyToMessageId?: string | null;
}

interface JoinProjectPayload {
  projectId: string;
}

export const registerChatSocket = (
  io: Server,
  sendMessageUseCase: ISendMessageUseCase,
  joinProjectChatUseCase: IJoinProjectChatUseCase
): void => {
  io.on("connection", (socket: Socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.onAny((event, ...args) => {
      console.log("📡 EVENT RECEIVED:", event, args);
    });

    socket.on(
      "join_project",
      async ({ projectId }: JoinProjectPayload) => {
        try {
          const user = socket.data.user;

          if (!user) {
            return socket.emit("chat_error", {
              message: "Unauthorized",
            });
          }

          if (!projectId) {
            return socket.emit("chat_error", {
              message: "ProjectId required",
            });
          }

          await joinProjectChatUseCase.execute(
            user.id,
            user.companyId,
            projectId
          );


          socket.join(projectId);

          socket.emit("joined_project", { projectId });

          console.log(
            "JOINED ROOM:",
            projectId,
            "Rooms:",
            Array.from(socket.rooms)
          );

        } catch (err: unknown) {
          console.log("Join project error:", err);

          let message = "Failed to join project";

          if (err instanceof Error) {
            message = err.message;
          }

          socket.emit("chat_error", { message });
        }
      }
    );

    /* ================= SEND MESSAGE ================= */
    socket.on(
      "send_message",
      async (payload: SendMessagePayload) => {
        try {
const user = {
  id: "temp-user",
  companyId: "temp-company",
};

          if (!payload.projectId || !payload.message) {
            return socket.emit("chat_error", {
              message: "Invalid payload",
            });
          }

          const createdMessage = await sendMessageUseCase.execute(
            user.id,
            user.companyId,
            payload.projectId,
            {
              message: payload.message,
              replyToMessageId: payload.replyToMessageId ?? null,
            }
          );


          const messagePayload = {
            id: createdMessage.id,
            projectId: createdMessage.projectId,
            senderId: createdMessage.senderId,
            senderName: createdMessage.senderName,
            message: createdMessage.message,
            attachmentUrl: createdMessage.attachmentUrl,
            attachmentType: createdMessage.attachmentType,
            fileName: createdMessage.fileName,

            replyToMessageId: createdMessage.replyToMessageId,
            createdAt: createdMessage.createdAt,
          };


          socket
            .to(payload.projectId)
            .emit("receive_message", messagePayload);


          socket.emit("receive_message", messagePayload);
        } catch (err) {
          console.log("Send message error:", err);

          socket.emit("chat_error", {
            message: "Failed to send message",
          });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};