import { Server, Socket } from "socket.io";

export const registerNotificationSocket=(io:Server):void=>{
    io.on("connection",(socket:Socket)=>{
            console.log("🔥 Notification socket connected:", socket.id);

    console.log("👤 Socket user:", socket.data.user);
        const user=socket.data.user;
        if(user?.id){
            socket.join(`user:${user.id}`);
            console.log("🔔 User joined notification room:", `user:${user.id}`);
        }
    })
}