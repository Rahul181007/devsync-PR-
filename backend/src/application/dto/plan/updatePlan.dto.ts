export interface UpdatePlanDTO {
  name?: string;
  description?: string;
  pricePerMonth?: number;
  pricePerYear?: number;
  currency?: "USD" | "INR" | "EUR";
  features?: string[];
  limits?: {
    maxProjects?: number;
    maxDevelopers?: number;
    maxStorageGB?: number;
  };
  isActive?: boolean;
}