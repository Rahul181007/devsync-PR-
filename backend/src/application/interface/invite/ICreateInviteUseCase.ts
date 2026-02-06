import { CreateInviteInput } from "../../dto/invite/createInvite.dto";
import { CreateInviteResponse } from "../../dto/invite/createInviteResponse.dto";
import { InviterContext } from "../../dto/invite/inviterContext.dto";

export interface ICreateInviteUseCase {
  execute(
    input: CreateInviteInput,
    inviter: InviterContext,
    companyId: string
  ): Promise<CreateInviteResponse>;
}