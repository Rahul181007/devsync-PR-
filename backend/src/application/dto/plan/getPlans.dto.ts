export interface GetPlansDTO {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
}