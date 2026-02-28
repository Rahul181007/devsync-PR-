import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { verifySocketToken } from "./socketAuth.middleware";
import { joinProjectChatUseCase, sendMessageUseCase } from "../../di/chat.di";
import { registerChatSocket } from "./chat.socket";
import { env } from "../../config/env";

export const initSocketServer=(httpServer:HttpServer)=>{
    const io=new Server(httpServer,{
  cors: {
    origin: env.FRONTEND_URL, 
    credentials: true,
  },
    })
    io.use(verifySocketToken)


    registerChatSocket(io, sendMessageUseCase,joinProjectChatUseCase);

     return io;
}
