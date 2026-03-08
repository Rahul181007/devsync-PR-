import { http } from "../../../core/api/http";
import type { CreatePlanRequest, GetPlansParams, UpdatePlanRequest } from "../typess/plan.types";

export const planApi={
    createPlan(data:CreatePlanRequest){
          return http.post("/superadmin/plans", data);
    },
      getPlans(params?: GetPlansParams) {
    return http.get("/superadmin/plans", { params });
  },

  getPlanById(id: string) {
    return http.get(`/superadmin/plans/${id}`);
  },

  updatePlan(id: string, data: UpdatePlanRequest) {
    return http.put(`/superadmin/plans/${id}`, data);
  },

  deletePlan(id: string) {
    return http.delete(`/superadmin/plans/${id}`);
  }
}