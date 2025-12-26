import { AcceptInviteUseCase } from "../application/use-cases/invite/acceptInvite.usecase";
import { CreateInviteUseCase } from "../application/use-cases/invite/createInvite.usecase";
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

const createInviteUseCase=new CreateInviteUseCase(
    inviteRepository,
    companyRepository,
    mailService
);
const verifyInviteUseCase=new VerifyInviteUseCase(inviteRepository)
const acceptInviteUseCase=new AcceptInviteUseCase(
    inviteRepository,
    useRepository,
    companyRepository,
    passwordHasher
)

export const inviteController=new InviteController(
    createInviteUseCase,
    verifyInviteUseCase,
    acceptInviteUseCase
)