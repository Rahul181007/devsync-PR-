import { useAppDispatch, useAppSelector } from "../../../store/hook"
import { markAllNotificationsAsRead } from "../store/notification.slice";
import NotificationItem from "./NotificationItem";


const NotificationDropdown = () => {
    const dispatch=useAppDispatch();
    const {items,loading}=useAppSelector(state=>state.notification)

 return (
    <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl border border-gray-200 z-50">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold text-gray-700">
          Notifications
        </h3>

        {items.length > 0 && (
          <button
            onClick={() => dispatch(markAllNotificationsAsRead())}
            className="text-xs text-indigo-600 hover:underline"
          >
            Mark all
          </button>
        )}
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading && (
          <div className="p-4 text-center text-gray-500">
            Loading...
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        )}

        {!loading &&
          items.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;
