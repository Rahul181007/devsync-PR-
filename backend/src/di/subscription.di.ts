import { IGetCompanySubscriptionUseCase } from "../application/interface/subscription/IGetCompanySubscriptionUseCase";
import { GetCompanySubscriptionUseCase } from "../application/use-cases/subscription/getCompanySubscription.usecase";
import { CompanyRepository } from "../infrastructure/repositories/company.repository";
import { PlanRepository } from "../infrastructure/repositories/plan.repository";
import { SubscriptionRepository } from "../infrastructure/repositories/subscription.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { SubscriptionController } from "../interfaces/controllers/subscription.controller";

const userRepo=new UserRepository();
const companyRepo=new CompanyRepository();
const planRepo=new PlanRepository();
const subscriptionRepo=new SubscriptionRepository();

const getCompanySubscriptionUsecase:IGetCompanySubscriptionUseCase=new GetCompanySubscriptionUseCase(userRepo,companyRepo,planRepo,subscriptionRepo);

export const  subscriptionController=new SubscriptionController(getCompanySubscriptionUsecase)