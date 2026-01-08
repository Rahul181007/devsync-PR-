import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IFileStorage } from "../../../domain/service/fileStorage.service";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { UpdateCompanyBrandingInput } from "../../dto/company/updateBranding.dto";

export class UpdateCompanyBrandingUseCase{
    constructor(
        private companyRepo:ICompanyRepository,
        private fileStorage:IFileStorage
    ){}

    async execute(companyId:string,data:UpdateCompanyBrandingInput){
        const company=await this.companyRepo.findById(companyId);

        if(!company){
            throw new AppError(
                RESPONSE_MESSAGES.COMPANY.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }


        let logoUrl=company.logoUrl
        let uploadedLogoUrl:string|undefined;

        try {
            if(data.logoFile){
                uploadedLogoUrl=await this.fileStorage.upload({
                    file:data.logoFile,
                    folder:`companies/${companyId}/branding`,
                    contentType: data.logoMimeType ?? "image/jpeg",
                })
                logoUrl=uploadedLogoUrl
            }

            await this.companyRepo.updateBranding(companyId,{
                ...(logoUrl!==undefined && {logoUrl}),
                ...(data.themeColor!==undefined && {themeColor:data.themeColor})
            })

            if(data.logoFile && company.logoUrl){
                await this.fileStorage.delete(company.logoUrl)
            }
        } catch (error) {
            if(uploadedLogoUrl){
                await this.fileStorage.delete(uploadedLogoUrl)
            }
            throw error
        }
       
    }

    
}