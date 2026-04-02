import { http } from "../../../core/api/http";
import type { CompanyDashboardData } from "../types/dashboard.types";

export const companyDashboardApi = {
  getDashboard() {
    return http.get<{ success: boolean; data: CompanyDashboardData }>(
      "/company/dashboard"
    );
  },
};