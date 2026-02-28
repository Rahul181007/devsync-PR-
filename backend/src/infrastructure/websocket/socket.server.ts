import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { verifySocketToken } from "./socketAuth.middleware";
import { sendMessageUseCase } from "../../di/chat.di";
import { registerChatSocket } from "./chat.socket";
import { env } from "../../config/env";

export const initSocketServer=(httpServer:HttpServer)=>{
    const io=new Server(httpServer,{
  cors: {
    origin: env.FRONTEND_URL, // http://localhost:5173
    credentials: true,
  },
    })
    io.use(verifySocketToken)

    registerChatSocket(io, sendMessageUseCase);

     return io;
}
