import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { CompanyDashboardData } from "../types/dashboard.types";

export const companyDashboardApi = {
  getDashboard() {
    return http.get<{ success: boolean; data: CompanyDashboardData }>(
      API_ROUTES.COMPANY.DASHBOARD
    );
  },
};