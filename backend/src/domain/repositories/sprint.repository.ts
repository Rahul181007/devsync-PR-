import { Sprint } from "../entities/sprint.entity";

export interface CreateSprintInput {
  projectId: string;
  companyId: string;

  name: string;
  goal?: string | null;

  startDate: Date;
  endDate: Date;
  createdBy: string

  status: "PLANNED";
  stories?: string[];
}

export interface ISprintRepository {
  create(data: CreateSprintInput): Promise<Sprint>;

  findById(id: string): Promise<Sprint | null>;

  findByProjectId(projectId: string): Promise<Sprint[]>;

  findActiveSprint(projectId: string): Promise<Sprint | null>;

  update(sprint: Sprint): Promise<Sprint>;
}

