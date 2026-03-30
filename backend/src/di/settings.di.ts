import { IGetProfileUseCase } from "../application/interface/auth/IGetProfileUseCase";
import { IResetPasswordForAuthenticatedUserUseCase } from "../application/interface/auth/IResetPasswordForAuthenticatedUserUseCase";
import { ISendOtpForAuthenticatedUserUseCase } from "../application/interface/auth/ISendOtpForAuthenticatedUserUseCase";
import { IUpdateProfileAvatarUseCase } from "../application/interface/auth/IUpdateProfileAvatarUseCase";
import { IUpdateProfileUseCase } from "../application/interface/auth/IUpdateProfileUseCase";
import { IVerifyOtpForAuthenticatedUserUseCase } from "../application/interface/auth/IVerifyOtpForAuthenticatedUserUseCase";
import { IUpdateCompanyLogoFromSettingsUseCase } from "../application/interface/company/IUpdateCompanyLogoFromSettingsUseCase";
import { GetProfileUseCase } from "../application/use-cases/auth/getProfile.usecase";
import { ResetPasswordForAuthenticatedUserUseCase } from "../application/use-cases/auth/ResetPasswordForAuthenticatedUser.usecase";
import { SendOtpForAuthenticatedUserUseCase } from "../application/use-cases/auth/SendOtpForAuthenticatedUserUseCase";
import { UpdateProfileUseCase } from "../application/use-cases/auth/updateProfile.usecase";
import { UpdateProfileAvatarUseCase } from "../application/use-cases/auth/updateProfileAvatar.usecase";
import { VerifyOtpForAuthenticatedUserUseCase } from "../application/use-cases/auth/VerifyOtpForAuthenticated.usecase";
import { UpdateCompanyLogoFromSettingsUseCase } from "../application/use-cases/company/updateCompanyLogoFromSettings.usecase";
import { CompanyRepository } from "../infrastructure/repositories/company.repository";
import { PasswordResetRepository } from "../infrastructure/repositories/passwordReset.repository";
import { SuperAdminRepository } from "../infrastructure/repositories/superAdmin.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { NodemailerService } from "../infrastructure/services/mail/nodemailer.service";
import { S3FileStorage } from "../infrastructure/services/S3/s3FileStorage.service";
import { SettingsController } from "../interfaces/controllers/setting.controller";

const userRepo = new UserRepository();
const superAdminRepo = new SuperAdminRepository();
const passwordResetRepo = new PasswordResetRepository();
const companyRepo=new CompanyRepository()
const mailService = new NodemailerService();

const fileStorage = new S3FileStorage();

const sendOtpUseCase:ISendOtpForAuthenticatedUserUseCase=new SendOtpForAuthenticatedUserUseCase(
    userRepo,
    superAdminRepo,
    passwordResetRepo,
    mailService
)

const verifyOtpUseCase:IVerifyOtpForAuthenticatedUserUseCase=new VerifyOtpForAuthenticatedUserUseCase(
    userRepo,
    superAdminRepo,
    passwordResetRepo
)

const resetPasswordUseCase:IResetPasswordForAuthenticatedUserUseCase=new ResetPasswordForAuthenticatedUserUseCase(
    userRepo,
    superAdminRepo,
    passwordResetRepo
)

const getProfileUseCase:IGetProfileUseCase=new GetProfileUseCase(
    userRepo,superAdminRepo,companyRepo
)

const updateProfileUseCase:IUpdateProfileUseCase=new UpdateProfileUseCase(userRepo,superAdminRepo)
const updateProfileAvatarUseCase:IUpdateProfileAvatarUseCase=new UpdateProfileAvatarUseCase(userRepo,superAdminRepo,fileStorage);
const updateCompanyLogoFromSettingsUseCase:IUpdateCompanyLogoFromSettingsUseCase=new UpdateCompanyLogoFromSettingsUseCase(userRepo,companyRepo,fileStorage)

export const settingsController=new SettingsController(
    sendOtpUseCase,
    verifyOtpUseCase,
    resetPasswordUseCase,
    getProfileUseCase,
    updateProfileUseCase,
    updateProfileAvatarUseCase,
    updateCompanyLogoFromSettingsUseCase
)