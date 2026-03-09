export interface GetAvailablePlansResponseDTO {
  id: string;
  name: string;
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
}