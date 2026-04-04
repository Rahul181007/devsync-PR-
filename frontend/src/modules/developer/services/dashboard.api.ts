import { http } from "../../../core/api/http";
import type { DeveloperDashboardData } from "../types/dashboard.types";

export const developerDashboardApi = {
  getDashboard() {
    return http.get<{ success: boolean; data: DeveloperDashboardData }>(
      "/developer/dashboard"
    );
  },
};