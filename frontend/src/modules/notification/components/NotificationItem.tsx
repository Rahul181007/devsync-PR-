import { useAppDispatch } from "../../../store/hook";
import { markNotificationAsRead } from "../store/notification.slice";
import type { Notification } from "../types/notification.types";

interface Props {
  notification: Notification;
}

const NotificationItem = ({ notification }: Props) => {
  const dispatch = useAppDispatch();

  const handleRead = () => {
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification.id));
    }
  };

  const handleTickClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent row click
    handleRead();
  };

  return (
    <div
      onClick={handleRead}
      className={`px-4 py-3 cursor-pointer transition hover:bg-gray-50 border-b flex justify-between items-start ${
        notification.isRead ? "bg-white" : "bg-indigo-50"
      }`}
    >
      {/* Left Content */}
      <div className="flex-1 pr-2">
        <p
          className={`text-sm ${
            notification.isRead
              ? "text-gray-700"
              : "font-semibold text-gray-900"
          }`}
        >
          {notification.title}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          {notification.message}
        </p>

        <p className="text-[10px] text-gray-400 mt-1">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>

      {/* ✔ Button */}
      {!notification.isRead && (
        <button
          onClick={handleTickClick}
          className="text-green-500 hover:text-green-700 text-sm font-bold"
        >
          ✔
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
