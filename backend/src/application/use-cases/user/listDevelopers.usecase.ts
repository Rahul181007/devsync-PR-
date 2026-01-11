
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { ListDevelopersQuery } from "../../dto/user/listDevelopers.dto";



export class ListDeveloperUsecase{
    constructor(
        private userRepo:IUserRepository
    ){}
    async execute(companyId:string,query:ListDevelopersQuery){
        if(!companyId){
            throw new AppError(
                RESPONSE_MESSAGES.COMPANY.NOT_FOUND,
                HttpStatus.BAD_REQUEST
            )
        }

        const page=Math.max(Number(query.page)||1,1);
        const limit=Math.min(Number(query.limit)||10,10);
        const {items,total}=
        await this.userRepo.findDevelopersByCompany(companyId,{
            page,
            limit,
            search:query.search,
            status:query.status
        })

        return{
            items,
            pagination:{
                page,
                limit,
                total,
                totalPages:Math.ceil(total/limit)
            }
        }

    }
}