import { Server, Socket } from "socket.io";
import { ISendMessageUseCase } from "../../application/interface/chat/ISendMessageUseCase";

interface SendMessagePayload {
    projectId: string;
    message: string;
    replyToMessageId?: string | null
}
interface JoinProjectPayload {
    projectId: string
}

export const registerChatSocket = (
    io: Server,
    sendMessageUseCase: ISendMessageUseCase,
    
): void => {
    io.on("connection", (socket: Socket) => {

          console.log("✅ Socket connected:", socket.id);

  socket.onAny((event, ...args) => {
    console.log("📡 EVENT RECEIVED:", event, args);
  });
        console.log("Socket connected", socket.id)

        socket.on("join_project",
            ({ projectId }: JoinProjectPayload) => {
                if (!projectId) return;
                socket.join(projectId)
            }
        )

        socket.on(
            "send_message",
            async (payload: SendMessagePayload) => {
                try {
                    const user = socket.data.user;

                    if (!user) {
                        return socket.emit("chat_error", {
                            message: "Unauthorized"
                        });
                    }

                    if (!payload.projectId || !payload.message) {
                        return socket.emit("chat_error", {
                            message: "Invalid payload"
                        });
                    }

                    const createdMessage = await sendMessageUseCase.execute(
                        user.id,
                        user.companyId,
                        payload.projectId,
                        {
                            message: payload.message,
                            replyToMessageId:
                                payload.replyToMessageId ?? null
                        }
                    );

                    io.to(payload.projectId).emit(
                        "receive_message",
                        createdMessage
                    );


                } catch {
                    socket.emit("chat_error", {
                        message: "Failed to send message"
                    });
                }
            }
        )

            socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
    })


}