import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { DeveloperDashboardData } from "../types/dashboard.types";

export const developerDashboardApi = {
  getDashboard() {
    return http.get<{ success: boolean; data: DeveloperDashboardData }>(
      API_ROUTES.DEVELOPER.DASHBOARD
    );
  },
};