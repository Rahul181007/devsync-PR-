import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

export class GetMyCompanyUseCase{
    constructor(
        private _companyRepo:ICompanyRepository
    ){}

    async execute(companyId:string){
        const company=await this._companyRepo.findById(companyId)

        if(!company){
            throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_FOUND,HttpStatus.NOT_FOUND)
        }
        return {
            id:company.id,
            name:company.name,
            status:company.status,
            logoUrl:company.logoUrl??null,
            themeColor:company.themeColor??null
        }

    }
}