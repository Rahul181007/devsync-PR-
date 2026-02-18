import { useEffect } from "react";
import { useAppDispatch } from "./store/hook";
import { Toaster } from "react-hot-toast";

import AppRouter from "./router/AppRouter";
import { bootstrapAuth } from "./modules/auth/auth.slice";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "8px",
            fontSize: "14px",
          },
        }}
      />
      
      <AppRouter />
    </>
  );
};

export default App;




