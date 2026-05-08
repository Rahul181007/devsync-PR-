import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IFileStorage } from "../../../domain/service/fileStorage.service";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { UpdateCompanyLogoFromSettingsDTO } from "../../dto/company/updateCompanyLogoFromSettings.dto";
import { IUpdateCompanyLogoFromSettingsUseCase } from "../../interface/company/IUpdateCompanyLogoFromSettingsUseCase";

export class UpdateCompanyLogoFromSettingsUseCase implements IUpdateCompanyLogoFromSettingsUseCase {
    constructor(
        private _userRepo: IUserRepository,
        private _companyRepo: ICompanyRepository,
        private _fileStorage: IFileStorage,
    ) { }

    async execute(data: UpdateCompanyLogoFromSettingsDTO): Promise<{ message: string; }> {
        const user = await this._userRepo.findById(data.userId);
        if (!user || !user.companyId) {
            throw new AppError(
                RESPONSE_MESSAGES.COMPANY.NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }

        const company = await this._companyRepo.findById(user.companyId);
        if (!company) {
            throw new AppError(
                RESPONSE_MESSAGES.COMPANY.NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }

        const allowedMimeTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (!allowedMimeTypes.includes(data.file.mimetype)) {
            throw new AppError(
                "Only image files are allowed",
                HttpStatus.BAD_REQUEST
            );
        }

        const logoUrl = await this._fileStorage.upload({
            file: data.file.buffer,
            folder: `companies/${user.companyId}/branding`,
            contentType: data.file.mimetype,
        });

        await this._companyRepo.updateBranding(user.companyId, {
            logoUrl
        })

        return {
            message: RESPONSE_MESSAGES.COMPANY.BRANDING_UPDATED,
        };
    }
}