import { useEffect } from "react";
import { useAppDispatch } from "./store/hook";
import { superAdminRefresh } from "./modules/auth/auth.slice";
import AppRouter from "./router/AppRouter";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(superAdminRefresh());
  }, [dispatch]);

  return <AppRouter />;
};

export default App;

