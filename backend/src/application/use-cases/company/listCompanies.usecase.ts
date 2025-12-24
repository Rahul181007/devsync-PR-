import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { ListCompaniesQuery } from "../../dto/company/listCompanies.dto";

export class ListCompaniesUseCase{
    constructor(
        private companyRepo:ICompanyRepository
    ){}

    async execute(query:ListCompaniesQuery){
        const result =await this.companyRepo.findAll(query);
        const totalPages=Math.ceil(result.total/query.limit)
        return {
            items:result.items,
            pagination:{
                page:query.page,
                limit:query.limit,
                totalItems:result.total,
                totalPages:totalPages,
            }
        }
    }
}