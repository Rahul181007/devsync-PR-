import { UserStatus } from "../../../domain/entities/user.entity";

export interface ListDevelopersQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
}