import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hook";
import { Toaster } from "react-hot-toast";

import AppRouter from "./router/AppRouter";
import { bootstrapAuth } from "./modules/auth/auth.slice";
import { connectSocket } from "./shared/socket";
import { addRealtimeNotification } from "./modules/notification/store/notification.slice";
import Spinner from "./shared/components/LoadingSpinner";

const App = () => {
  const dispatch = useAppDispatch();
  const isAuthChecked = useAppSelector(state => state.auth.isAuthChecked);
   const isAuthenticated=useAppSelector(state=>state.auth.isAuthenticated)
  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  useEffect(() => {
  if (isAuthChecked && isAuthenticated) {
    const socket = connectSocket();
        socket.on("new_notification", (notification) => {
      dispatch(addRealtimeNotification(notification));
    });
    return () => {
      socket.disconnect();
    };
  }
}, [isAuthChecked, isAuthenticated,dispatch]);

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm font-medium text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <AppRouter />
    </>
  );
};

export default App;




