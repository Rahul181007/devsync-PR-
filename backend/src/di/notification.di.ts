import { IGetUnreadCountUseCase } from "../application/interface/notification/IGetUnreadCountUseCase";
import { IGetUserNotificationsUseCase } from "../application/interface/notification/IGetUserNotificationsUseCase";
import { IMarkAllAsReadUseCase } from "../application/interface/notification/IMarkAllAsReadUseCase";
import { IMarkNotificationAsReadUseCase } from "../application/interface/notification/IMarkNotificationAsReadUseCase";
import { GetUnreadCountUseCase } from "../application/use-cases/notification/GetUnreadCountUseCase";
import { GetUserNotificationsUseCase } from "../application/use-cases/notification/getUserNotifications.usecase";
import { MarkAllAsReadUseCase } from "../application/use-cases/notification/MarkAllAsReadUseCase";
import { MarkNotificationAsReadUseCase } from "../application/use-cases/notification/markNotificationAsRead.usecase";
import { NotificationRepository } from "../infrastructure/repositories/notification.repository";
import { NotificationController } from "../interfaces/controllers/notification.controller";

const notificationRepository=new NotificationRepository();

const getUserNotificationsUseCase:IGetUserNotificationsUseCase=new GetUserNotificationsUseCase(notificationRepository);
const markNotificationAsReadUseCase:IMarkNotificationAsReadUseCase=new MarkNotificationAsReadUseCase(notificationRepository);
const getUnreadCountUseCase:IGetUnreadCountUseCase=new GetUnreadCountUseCase(notificationRepository);
const markAllAsReadUseCase:IMarkAllAsReadUseCase=new MarkAllAsReadUseCase(notificationRepository)
export const notificationController=new NotificationController(getUserNotificationsUseCase,markNotificationAsReadUseCase,getUnreadCountUseCase,markAllAsReadUseCase)