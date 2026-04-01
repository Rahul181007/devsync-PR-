import { configureStore, combineReducers} from "@reduxjs/toolkit";
import type {UnknownAction } from "@reduxjs/toolkit";

import authReducer from '../modules/auth/auth.slice';
import companiesReducer from '../modules/super-admin/store/companies.slice';
import companyReducer from '../modules/company-admin/store/company.slice';
import projectReducer from '../modules/company-admin/store/project.slice';
import developerReducer from '../modules/company-admin/store/developer.slice';
import developerProjectsReducer from '../modules/developer/store/project.slice';
import companyAdminTaskReducer from '../modules/company-admin/store/task.slice';
import developerTaskReducer from '../modules/developer/store/task.slice';
import companyAdminSprintReducer from '../modules/company-admin/store/sprint.slice';
import devStandupReducer from "../modules/developer/store/standup.slice";
import companyStandupReducer from '../modules/company-admin/store/standup.slice';
import companyChatReducer from '../modules/chat/store/chat.slice';
import aiReducer from "../modules/ai/store/ai.slice";
import notificationReducer from "../modules/notification/store/notification.slice"
import planReducer from "../modules/super-admin/store/plan.slice";
import billingReducer from "../modules/company-admin/store/companyBilling.slice"
import devWorklogReducer from "../modules/developer/store/worklog.slice"
import adminWorklogReducer from "../modules/company-admin/store/worklog.slice";
import settingReducer from "../modules/settings/store/setting.slice"
import transactionReducer from "../modules/super-admin/store/transaction.slice"
import superAdminDashboardReducer from "../modules/super-admin/store/dashboard.slice"
/* ================= Combine ================= */

const appReducer = combineReducers({
  auth: authReducer,
  companies: companiesReducer,
  company: companyReducer,
  project: projectReducer,
  companyAdminDevelopers: developerReducer,
  developerProjects: developerProjectsReducer,
  companyAdminTask: companyAdminTaskReducer,
  developerTask: developerTaskReducer,
  companyAdminSprint: companyAdminSprintReducer,
  devStandup: devStandupReducer,
  companyStandup: companyStandupReducer,
  companyChat:companyChatReducer,
  ai:aiReducer,
  notification:notificationReducer,
  plans:planReducer,
  companyBiiling:billingReducer,
  devWorklog:devWorklogReducer,
  adminWorklog:adminWorklogReducer,
  setting:settingReducer,
  transaction:transactionReducer,
  superAdminDashboard:superAdminDashboardReducer
});

/* ================= RootState ================= */

export type RootState = ReturnType<typeof appReducer>;

/* ================= Root Reducer ================= */

const rootReducer = (
  state: RootState | undefined,
  action: UnknownAction
): RootState => {
  if (action.type === "auth/logout/fulfilled") {
    return appReducer(undefined, action); 
  }

  return appReducer(state, action);
};

/* ================= Store ================= */

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;