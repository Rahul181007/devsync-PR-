import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hook";
import { Toaster } from "react-hot-toast";

import AppRouter from "./router/AppRouter";
import { bootstrapAuth } from "./modules/auth/auth.slice";
import { connectSocket } from "./shared/socket";
import { addRealtimeNotification } from "./modules/notification/store/notification.slice";

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
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        Loading...
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




