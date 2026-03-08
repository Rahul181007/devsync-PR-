export type Currency = "USD" | "INR" | "EUR";
export type PlanStatusFilter = "all" | "active" | "inactive";
export interface PlanLimits {
  maxProjects: number;
  maxDevelopers: number;
  maxStorageGB: number;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricePerMonth: number;
  pricePerYear: number;
  currency: Currency;
  features: string[];
  limits: PlanLimits;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  pricePerMonth: number;
  pricePerYear: number;
  currency: Currency;
  features: string[];
  limits: PlanLimits;
}

export interface UpdatePlanRequest {
  name?: string;
  description?: string;
  pricePerMonth?: number;
  pricePerYear?: number;
  currency?: Currency;
  features?: string[];
  limits?: Partial<PlanLimits>;
  isActive?: boolean;
}

export interface GetPlansParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "inactive";
}

export interface GetPlansResponse {
  items: Plan[];
  total: number;
}