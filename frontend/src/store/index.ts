import { configureStore } from "@reduxjs/toolkit";
import  authReducer from '../modules/auth/auth.slice';
import companiesReducer from '../modules/super-admin/store/companies.slice'
export const store=configureStore({
    reducer:{
        auth:authReducer,
        companies:companiesReducer
    }
})


export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;