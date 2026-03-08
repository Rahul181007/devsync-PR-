export interface GetPlansDTO {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "inactive";
}