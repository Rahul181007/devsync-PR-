import { BlockCompanyAdminUseCase } from "../application/use-cases/user/blockCompanyAdmin.usecase";
import { BlockDeveloperUseCase } from "../application/use-cases/user/blockDeveloper.usecase";
import { ListDeveloperUsecase } from "../application/use-cases/user/listDevelopers.usecase";
import { UnblockCompanyAdminUseCase } from "../application/use-cases/user/unblockCompanyAdmin.usecase";
import { UnblockDeveloperUseCase } from "../application/use-cases/user/unblockDeveloper.usecase";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { UserController } from "../interfaces/controllers/user.controller";

const userRepository=new UserRepository();

const blockCompanyAdminUseCase=new BlockCompanyAdminUseCase(userRepository);
const unblockCompanyAdminUseCase=new UnblockCompanyAdminUseCase(userRepository);
const listDeveloperUseCase=new ListDeveloperUsecase(userRepository);
const blockDeveloperUseCase=new BlockDeveloperUseCase(userRepository);
const unblockDeveloperUseCase=new UnblockDeveloperUseCase(userRepository);


export const userController=new UserController(
    blockCompanyAdminUseCase,
    unblockCompanyAdminUseCase,
    listDeveloperUseCase,
    blockDeveloperUseCase,
    unblockDeveloperUseCase
)