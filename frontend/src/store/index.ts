import { configureStore } from "@reduxjs/toolkit";
import  authReducer from '../modules/auth/auth.slice';
import companiesReducer from '../modules/super-admin/store/companies.slice';
import companyReducer from '../modules/company-admin/store/company.slice'
import projectReducer from '../modules/company-admin/store/project.slice'
import developerReducer from '../modules/company-admin/store/developer.slice'
import developerProjectsReducer from '../modules/developer/store/project.slice'
export const store=configureStore({
    reducer:{
        auth:authReducer,
        companies:companiesReducer, // superAdminCompanies
        company:companyReducer,
        project:projectReducer,
        companyAdminDevelopers:developerReducer,
         developerProjects: developerProjectsReducer,
    }
})


export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;