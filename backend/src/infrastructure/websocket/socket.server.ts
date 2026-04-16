import { Server } from "socket.io";
import { Server as HttpServer } from "http";
// import { verifySocketToken } from "./socketAuth.middleware";
import { joinProjectChatUseCase, sendMessageUseCase } from "../../di/chat.di";
import { registerChatSocket } from "./chat.socket";
import { env } from "../../config/env";
import { registerNotificationSocket } from "./notification.socket";
import { setSocketInstance } from "./socket.instance";




export const initSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        env.FRONTEND_URL
      ],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  })
  // io.use(verifySocketToken)


  registerChatSocket(io, sendMessageUseCase, joinProjectChatUseCase);
  registerNotificationSocket(io)
  setSocketInstance(io)
  return io;
}
