import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hook";
import { Toaster } from "react-hot-toast";

import AppRouter from "./router/AppRouter";
import { bootstrapAuth } from "./modules/auth/auth.slice";

const App = () => {
  const dispatch = useAppDispatch();
  const isAuthChecked = useAppSelector(state => state.auth.isAuthChecked);

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

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




