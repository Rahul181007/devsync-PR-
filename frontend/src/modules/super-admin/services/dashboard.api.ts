import { http } from "../../../core/api/http"
import { API_ROUTES } from "../../../shared/constants/api.routes";

export const dashboardApi={
    getSuperAdminDashboard(){
        return http.get(API_ROUTES.SUPER_ADMIN.DASHBOARD);
    }
}