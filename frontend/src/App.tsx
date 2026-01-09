import { useEffect } from "react";
import { useAppDispatch } from "./store/hook";

import AppRouter from "./router/AppRouter";
import { bootstrapAuth } from "./modules/auth/auth.slice";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
   dispatch(bootstrapAuth()) 
  }, [dispatch]);



  return <AppRouter />;
};

export default App;



