import { http } from "../../../core/api/http"
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { Notification } from "../types/notification.types";

export const notificationApi={
    getNotifications(){
        return http.get<{success:boolean;data:Notification[]}>(
            API_ROUTES.COMMON.NOTIFICATIONS
        )
    },

    getUnreadCount(){
        return http.get<{success:boolean;data:{count:number}}>(
            API_ROUTES.COMMON.UNREAD_COUNT
        )
    },

    markAsRead(notificationId:string){
        return http.patch(API_ROUTES.COMMON.MARK_AS_READ(notificationId))
    },

    markAllAsRead(){
        return http.patch(API_ROUTES.COMMON.MARK_ALL_AS_READ)
    }
}