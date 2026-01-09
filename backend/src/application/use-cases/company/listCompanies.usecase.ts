import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IInviteRepository } from "../../../domain/repositories/invites.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ListCompaniesQuery } from "../../dto/company/listCompanies.dto";

export class ListCompaniesUseCase{
    constructor(
        private companyRepo:ICompanyRepository,
        private inviteRepo:IInviteRepository,
        private userRepo:IUserRepository
    ){}

   async execute(query: ListCompaniesQuery) {
  const result = await this.companyRepo.findAll(query);

  const items = await Promise.all(
    result.items.map(async (company) => {
      let admin = undefined;

      if (company.ownerAdminId) {
        const user = await this.userRepo.findById(company.ownerAdminId);
        if (user) {
          admin = {
            id: user.id,
            email: user.email,
            status: user.status,
          };
        }
      }

      const hasPendingInvite =
        !company.ownerAdminId &&
        (await this.inviteRepo.hasPendingInviteForCompany(company.id));

      return {
        id: company.id,
        name: company.name,
        domain: company.domain,
        status: company.status,
        admin,
        hasPendingInvite,
      };
    })
  );

  const totalPages = Math.ceil(result.total / query.limit);

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      totalItems: result.total,
      totalPages,
    },
  };
}

}