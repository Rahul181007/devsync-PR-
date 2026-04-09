import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { CreatePlanRequest, GetPlansParams, UpdatePlanRequest } from "../typess/plan.types";

export const planApi={
    createPlan(data:CreatePlanRequest){
          return http.post(API_ROUTES.SUPER_ADMIN.PLANS, data);
    },
      getPlans(params?: GetPlansParams) {
    return http.get(API_ROUTES.SUPER_ADMIN.PLANS, { params });
  },

  getPlanById(id: string) {
    return http.get(API_ROUTES.SUPER_ADMIN.PLAN_BY_ID(id));
  },

  updatePlan(id: string, data: UpdatePlanRequest) {
    return http.put(API_ROUTES.SUPER_ADMIN.PLAN_BY_ID(id), data);
  },

  deletePlan(id: string) {
    return http.delete(API_ROUTES.SUPER_ADMIN.PLAN_BY_ID(id));
  }
}