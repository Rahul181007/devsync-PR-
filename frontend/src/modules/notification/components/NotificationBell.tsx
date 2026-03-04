import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  fetchUnreadCount,fetchNotifications
} from "../store/notification.slice";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const dispatch = useAppDispatch();
  const { unreadCount } = useAppSelector(
    (state) => state.notification
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const toggleDropdown = () => {
    setOpen((prev) => !prev);

    if (!open) {
      dispatch(fetchNotifications());
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative"
      >
        <FiBell className="text-xl text-gray-600 hover:text-slate-800 transition duration-200" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 text-[10px] flex items-center justify-center bg-red-500 text-white rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && <NotificationDropdown />}
    </div>
  );
};

export default NotificationBell;
