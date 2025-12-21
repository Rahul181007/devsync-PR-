import { useEffect } from "react";
import { useAppDispatch } from "./store/hook";
import { authApi } from "./modules/auth/services/auth.api";
import { setUser, clearAuth } from "./modules/auth/auth.slice";
import AppRouter from "./router/AppRouter";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const res = await authApi.getMe();
        dispatch(setUser(res.data.user));
      } catch {
        dispatch(clearAuth()); 
      }
    };

    bootstrapAuth();
  }, [dispatch]);

  return <AppRouter />;
};

export default App;



