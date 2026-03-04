import { http } from "../../../core/api/http"
import type { Notification } from "../types/notification.types";

export const notificationApi={
    getNotifications(){
        return http.get<{success:boolean;data:Notification[]}>(
            "/notifications"
        )
    },

    getUnreadCount(){
        return http.get<{success:boolean;data:{count:number}}>(
            "/notifications/unread-count"
        )
    },

    markAsRead(notificationId:string){
        return http.patch(`/notifications/${notificationId}/read`)
    },

    markAllAsRead(){
        return http.patch("/notifications/read-all")
    }
}