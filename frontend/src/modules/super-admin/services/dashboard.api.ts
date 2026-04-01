import { http } from "../../../core/api/http"

export const dashboardApi={
    getSuperAdminDashboard(){
        return http.get("superadmin/dashboard");
    }
}