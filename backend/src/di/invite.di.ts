import { IAcceptInviteUseCase } from "../application/interface/invite/IAcceptInviteUseCase";
import { ICreateInviteUseCase } from "../application/interface/invite/ICreateInviteUseCase";
import { IInviteDeveloperUseCase } from "../application/interface/invite/IInviteDeveloperUseCase";
import { IVerifyInviteUseCase } from "../application/interface/invite/IVerifyInviteUseCase";
import { AcceptInviteUseCase } from "../application/use-cases/invite/acceptInvite.usecase";
import { CreateInviteUseCase } from "../application/use-cases/invite/createInvite.usecase";
import { InviteDeveloperUseCase } from "../application/use-cases/invite/inviteDeveloper.usecase";
import { VerifyInviteUseCase } from "../application/use-cases/invite/verifyInvite.usecase";
import { CompanyRepository } from "../infrastructure/repositories/company.repository";
import { InviteRepository } from "../infrastructure/repositories/invite.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { BcryptPasswordHasher } from "../infrastructure/security/bcryptPasswordHasher";
import { NodemailerService } from "../infrastructure/services/mail/nodemailer.service";
import { InviteController } from "../interfaces/controllers/invite.controller";

const inviteRepository=new InviteRepository();
const companyRepository=new CompanyRepository();
const useRepository=new UserRepository();

const mailService=new NodemailerService();
const passwordHasher=new BcryptPasswordHasher();

const createInviteUseCase:ICreateInviteUseCase=new CreateInviteUseCase(
    inviteRepository,
    companyRepository,
    mailService
);
const verifyInviteUseCase:IVerifyInviteUseCase=new VerifyInviteUseCase(inviteRepository)
const acceptInviteUseCase:IAcceptInviteUseCase=new AcceptInviteUseCase(
    inviteRepository,
    useRepository,
    companyRepository,
    passwordHasher
)
const inviteDeveloperUseCase:IInviteDeveloperUseCase=new InviteDeveloperUseCase(inviteRepository,mailService,companyRepository)
export const inviteController=new InviteController(
    createInviteUseCase,
    verifyInviteUseCase,
    acceptInviteUseCase,
    inviteDeveloperUseCase
)