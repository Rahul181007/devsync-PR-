import { IBlockCompanyAdminUseCase } from "../application/interface/user/IBlockCompanyAdminUseCase";
import { IBlockDeveloperUseCase } from "../application/interface/user/IBlockDeveloperUseCase";
import { IListDevelopersUseCase } from "../application/interface/user/IListDevelopersUseCase";
import { IUnblockCompanyAdminUseCase } from "../application/interface/user/IUnblockCompanyAdminUseCase";
import { IUnblockDeveloperUseCase } from "../application/interface/user/IUnblockDeveloperUseCase";
import { BlockCompanyAdminUseCase } from "../application/use-cases/user/blockCompanyAdmin.usecase";
import { BlockDeveloperUseCase } from "../application/use-cases/user/blockDeveloper.usecase";
import { ListDeveloperUsecase } from "../application/use-cases/user/listDevelopers.usecase";
import { UnblockCompanyAdminUseCase } from "../application/use-cases/user/unblockCompanyAdmin.usecase";
import { UnblockDeveloperUseCase } from "../application/use-cases/user/unblockDeveloper.usecase";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { UserController } from "../interfaces/controllers/user.controller";

const userRepository=new UserRepository();

const blockCompanyAdminUseCase:IBlockCompanyAdminUseCase=new BlockCompanyAdminUseCase(userRepository);
const unblockCompanyAdminUseCase:IUnblockCompanyAdminUseCase=new UnblockCompanyAdminUseCase(userRepository);
const listDeveloperUseCase:IListDevelopersUseCase=new ListDeveloperUsecase(userRepository);
const blockDeveloperUseCase:IBlockDeveloperUseCase=new BlockDeveloperUseCase(userRepository);
const unblockDeveloperUseCase:IUnblockDeveloperUseCase=new UnblockDeveloperUseCase(userRepository);


export const userController=new UserController(
    blockCompanyAdminUseCase,
    unblockCompanyAdminUseCase,
    listDeveloperUseCase,
    blockDeveloperUseCase,
    unblockDeveloperUseCase
)