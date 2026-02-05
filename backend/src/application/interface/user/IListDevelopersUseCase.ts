import { ListDevelopersQuery } from "../../dto/user/listDevelopers.dto";
import { ListDevelopersResponse } from "../../dto/user/listDevelopersResponse.dto";

export interface IListDevelopersUseCase {
  execute(
    companyId: string,
    query: ListDevelopersQuery
  ): Promise<ListDevelopersResponse>;
}