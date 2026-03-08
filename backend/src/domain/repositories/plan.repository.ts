import { Plan } from "../entities/plan.entity";

 export interface ListPlanQuery {
  page: number
  limit: number
  search?: string
  status?: "all" | "active" | "inactive"
}

export interface CreatePlanData{
      name: string;
  slug: string;
  description: string;
  pricePerMonth: number;
  pricePerYear: number;
  currency: string;
  features: string[];
  limits: {
    maxProjects: number;
    maxDevelopers: number;
    maxStorageGB: number;
  };
  isActive: boolean;
}

export interface IPlanRepository {
    findByName(name:string):Promise<Plan|null>;

    findBySlug(slug:string):Promise<Plan|null>;

    create(data:CreatePlanData):Promise<Plan>;

    findAll(query:ListPlanQuery):Promise<{items:Plan[];total:number}>;

    findById(planId:string):Promise<Plan|null>;

    save(plan:Plan):Promise<void>;
    delete(planId:string):Promise<void>;
    findDefaultPlan(): Promise<Plan | null>;
}