import { ListProjectsQuery } from "../../dto/project/listProjects.dto";
import { ListProjectsResponse } from "../../dto/project/listProjectsResponse.dto";

export interface IListProjectsUseCase {
  execute(
    userId: string,
    companyId: string,
    query: ListProjectsQuery
  ): Promise<ListProjectsResponse>;
}